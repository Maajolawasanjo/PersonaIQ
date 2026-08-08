from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.errors import AppException, ErrorCode
from app.domain.presence.scoring import PresenceScoringEngine
from app.dto.presence import PresencePlanDTO
from app.providers.gateway import AIGateway
from app.repositories.journey_repository import JourneyRepository
from app.repositories.presence_repository import PresenceRepository
from app.repositories.upload_repository import UploadRepository


class PresenceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.journey_repo = JourneyRepository(db)
        self.upload_repo = UploadRepository(db)
        self.presence_repo = PresenceRepository(db)
        self.ai_gateway = AIGateway()

    async def run_ai_analysis(
        self, journey_id: UUID, user_id: UUID, correlation_id: Optional[str] = None
    ) -> PresencePlanDTO:
        journey = await self.journey_repo.get_by_id(journey_id, user_id)
        if not journey:
            raise AppException(
                code=ErrorCode.JOURNEY_001,
                message="Journey not found or access denied.",
                status_code=404,
            )

        from app.services.email_service import EmailService
        email_service = EmailService()
        user = journey.user
        user_name = f"{user.first_name or ''} {user.last_name or ''}".strip() if user else "there"
        event_title = journey.event.name if journey.event and journey.event.name else journey.title or "Your Analysis"

        # 1. Fetch Uploaded Assets
        selfie = await self.upload_repo.get_selfie(journey_id)
        outfits = await self.upload_repo.get_outfits(journey_id)

        selfie_url = selfie.storage_url if selfie else "/media/uploads/default_selfie.jpg"
        outfit_urls = [o.storage_url for o in outfits] if outfits else ["/media/uploads/default_outfit.jpg"]

        # Fire analysis-started AFTER assets confirmed — non-blocking
        # Assets are fetched but AI hasn't started; this is the correct commit point
        email_service.dispatch(
            None,
            email_service.send_analysis_started_email,
            user.email,
            user_name,
            event_title,
        )

        # 2. Invoke AI Providers via Gateway
        event_ctx = {
            "name": journey.event.name if journey.event else None,
            "industry": journey.event.industry if journey.event else None,
            "dress_code": journey.event.dress_code if journey.event else None,
            "importance": str(journey.event.importance) if journey.event else "3",
        }

        skin_result = await self.ai_gateway.analyze_skin(selfie_url)
        outfit_results = await self.ai_gateway.compare_outfits(
            selfie_url=selfie_url,
            outfit_urls=outfit_urls,
            event_context=event_ctx,
        )

        # 3. Save Skin Analysis & Outfit Comparisons
        await self.presence_repo.save_skin_analysis(journey.id, skin_result)
        await self.presence_repo.save_outfit_comparisons(journey.id, outfit_results)

        # 4. Pure Domain Presence Scoring
        importance = journey.event.importance if journey.event and journey.event.importance else 3
        dress_code = journey.event.dress_code if journey.event else None
        alignment_scores = [r.alignment_score for r in outfit_results]

        score_result = PresenceScoringEngine.calculate_presence_index(
            event_importance=importance,
            dress_code=dress_code,
            skin_overall_score=skin_result.overall_score,
            outfit_alignment_scores=alignment_scores,
        )

        # 5. LLM Recommendations & Checklist Generation
        llm_result = await self.ai_gateway.generate_recommendations(
            event_context=event_ctx,
            presence_score=score_result.overall_presence_index,
            skin_metrics=skin_result.metrics,
        )

        # 6. Save Presence Plan
        plan = await self.presence_repo.save_presence_plan(
            journey=journey,
            score=score_result,
            recommendations_data=llm_result.recommendations,
            checklist_data=llm_result.checklist,
            correlation_id=correlation_id,
        )

        # Fire analysis-ready AFTER plan is persisted — non-blocking
        dashboard_url = f"https://personaiq.com/dashboard/journeys/{journey_id}/plan"
        email_service.dispatch(
            None,
            email_service.send_analysis_ready_email,
            user.email,
            user_name,
            event_title,
            int(score_result.overall_presence_index),
            dashboard_url,
        )

        return PresencePlanDTO.model_validate(plan)

    async def get_presence_plan(self, journey_id: UUID, user_id: UUID) -> PresencePlanDTO:
        journey = await self.journey_repo.get_by_id(journey_id, user_id)
        if not journey:
            raise AppException(
                code=ErrorCode.JOURNEY_001,
                message="Journey not found or access denied.",
                status_code=404,
            )

        plan = await self.presence_repo.get_presence_plan(journey_id)
        if not plan:
            raise AppException(
                code=ErrorCode.JOURNEY_003,
                message="Presence Plan has not been generated for this journey yet.",
                status_code=404,
            )

        return PresencePlanDTO.model_validate(plan)
