from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.domain.presence.scoring import PresenceScoreResult
from app.models.analysis import OutfitComparison, SkinAnalysis
from app.models.journey import Journey, JourneyEventLog
from app.models.presence import PreparationChecklist, PresencePlan, Recommendation
from app.providers.gateway import OutfitComparisonResult, SkinAnalysisResult


class PresenceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_skin_analysis(
        self, journey_id: UUID, result: SkinAnalysisResult
    ) -> SkinAnalysis:
        analysis = SkinAnalysis(
            journey_id=journey_id,
            overall_skin_score=result.overall_score,
            metrics=result.metrics,
            concerns=result.concerns,
        )
        self.db.add(analysis)
        await self.db.flush()
        return analysis

    async def save_outfit_comparisons(
        self, journey_id: UUID, results: List[OutfitComparisonResult]
    ) -> List[OutfitComparison]:
        comparisons: List[OutfitComparison] = []
        for res in results:
            comp = OutfitComparison(
                journey_id=journey_id,
                vto_image_url=res.vto_image_url,
                alignment_score=res.alignment_score,
                feedback=res.feedback,
                ranking=res.ranking,
            )
            self.db.add(comp)
            comparisons.append(comp)
        await self.db.flush()
        return comparisons

    async def save_presence_plan(
        self,
        journey: Journey,
        score: PresenceScoreResult,
        recommendations_data: List[dict],
        checklist_data: List[dict],
        correlation_id: Optional[str] = None,
    ) -> PresencePlan:
        plan = PresencePlan(
            journey_id=journey.id,
            overall_presence_index=score.overall_presence_index,
            confidence_score=score.confidence_score,
            executive_vibe_score=score.executive_vibe_score,
            visual_impact_score=score.visual_impact_score,
            grooming_score=score.grooming_score,
            outfit_alignment_score=score.outfit_alignment_score,
            summary_narrative=score.summary_narrative,
        )
        self.db.add(plan)
        await self.db.flush()

        for rec in recommendations_data:
            r = Recommendation(
                presence_plan_id=plan.id,
                category=rec["category"],
                title=rec["title"],
                description=rec["description"],
                priority_order=rec["priority_order"],
                action_type=rec.get("action_type"),
            )
            self.db.add(r)

        for item in checklist_data:
            c = PreparationChecklist(
                presence_plan_id=plan.id,
                task=item["task"],
                category=item.get("category", "GENERAL"),
                due_offset_minutes=item.get("due_offset_minutes", -60),
            )
            self.db.add(c)

        # Update Journey status & step
        journey.status = "COMPLETED"
        journey.current_step = 4
        journey.active_presence_index = score.overall_presence_index
        journey.active_confidence = score.confidence_score

        log_entry = JourneyEventLog(
            journey_id=journey.id,
            event_type="AI_ANALYSIS_COMPLETED",
            payload={"presence_index": score.overall_presence_index},
            correlation_id=correlation_id,
        )
        self.db.add(log_entry)
        await self.db.flush()

        # Eager load relationships before return
        return await self.get_presence_plan(journey.id)

    async def get_presence_plan(self, journey_id: UUID) -> Optional[PresencePlan]:
        query = (
            select(PresencePlan)
            .options(
                selectinload(PresencePlan.recommendations),
                selectinload(PresencePlan.checklist),
            )
            .where(PresencePlan.journey_id == journey_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
