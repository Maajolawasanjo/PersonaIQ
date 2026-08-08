"""add_hardened_tables

Revision ID: f92026080700
Revises: e23d1b45a8c7
Create Date: 2026-08-07 18:05:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'f92026080700'
down_revision: Union[str, None] = 'e23d1b45a8c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use Alembic DSL with proper UUID types to match existing users/journeys schema

    op.create_table(
        'wardrobe_items',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('color', sa.String(100), nullable=True),
        sa.Column('formality', sa.String(100), nullable=True, server_default='Business Casual'),
        sa.Column('photo_url', sa.Text(), nullable=True),
        sa.Column('wear_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_favorite', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        if_not_exists=True,
    )
    op.create_index('idx_wardrobe_items_user_id', 'wardrobe_items', ['user_id'], if_not_exists=True)

    op.create_table(
        'wardrobe_outfits',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('item_ids', sa.JSON(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True, server_default='0.85'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        if_not_exists=True,
    )
    op.create_index('idx_wardrobe_outfits_user_id', 'wardrobe_outfits', ['user_id'], if_not_exists=True)

    op.create_table(
        'presence_goals',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('journey_id', sa.UUID(), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(100), nullable=True, server_default='Executive'),
        sa.Column('is_completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['journey_id'], ['journeys.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        if_not_exists=True,
    )
    op.create_index('idx_presence_goals_user_id', 'presence_goals', ['user_id'], if_not_exists=True)

    op.create_table(
        'presence_dna',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('archetype', sa.String(100), nullable=False),
        sa.Column('vibe_signature', sa.String(100), nullable=False),
        sa.Column('gravitas_score', sa.Integer(), nullable=True, server_default='80'),
        sa.Column('warmth_score', sa.Integer(), nullable=True, server_default='80'),
        sa.Column('clarity_score', sa.Integer(), nullable=True, server_default='80'),
        sa.Column('style_match_score', sa.Integer(), nullable=True, server_default='80'),
        sa.Column('analysis_summary', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        if_not_exists=True,
    )
    op.create_index('idx_presence_dna_user_id', 'presence_dna', ['user_id'], if_not_exists=True)

    op.create_table(
        'shared_journey_tokens',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('journey_id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('token', sa.String(255), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_revoked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('view_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['journey_id'], ['journeys.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token'),
        if_not_exists=True,
    )
    op.create_index('idx_shared_journey_tokens_token', 'shared_journey_tokens', ['token'], if_not_exists=True)
    op.create_index('idx_shared_journey_tokens_journey_id', 'shared_journey_tokens', ['journey_id'], if_not_exists=True)


def downgrade() -> None:
    op.drop_index('idx_shared_journey_tokens_journey_id', table_name='shared_journey_tokens')
    op.drop_index('idx_shared_journey_tokens_token', table_name='shared_journey_tokens')
    op.drop_table('shared_journey_tokens')
    op.drop_index('idx_presence_dna_user_id', table_name='presence_dna')
    op.drop_table('presence_dna')
    op.drop_index('idx_presence_goals_user_id', table_name='presence_goals')
    op.drop_table('presence_goals')
    op.drop_index('idx_wardrobe_outfits_user_id', table_name='wardrobe_outfits')
    op.drop_table('wardrobe_outfits')
    op.drop_index('idx_wardrobe_items_user_id', table_name='wardrobe_items')
    op.drop_table('wardrobe_items')
