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
    # Create wardrobe_items table if not exists
    op.execute("""
    CREATE TABLE IF NOT EXISTS wardrobe_items (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        color VARCHAR(100),
        formality VARCHAR(100) DEFAULT 'Business Casual',
        photo_url TEXT,
        wear_count INTEGER DEFAULT 0,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create wardrobe_outfits table if not exists
    op.execute("""
    CREATE TABLE IF NOT EXISTS wardrobe_outfits (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        item_ids JSON,
        confidence_score FLOAT DEFAULT 0.85,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create presence_goals table if not exists
    op.execute("""
    CREATE TABLE IF NOT EXISTS presence_goals (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        journey_id VARCHAR(36) REFERENCES journeys(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'Executive',
        is_completed BOOLEAN DEFAULT FALSE,
        due_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create presence_dna table if not exists
    op.execute("""
    CREATE TABLE IF NOT EXISTS presence_dna (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        archetype VARCHAR(100) NOT NULL,
        vibe_signature VARCHAR(100) NOT NULL,
        gravitas_score INTEGER DEFAULT 80,
        warmth_score INTEGER DEFAULT 80,
        clarity_score INTEGER DEFAULT 80,
        style_match_score INTEGER DEFAULT 80,
        analysis_summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create shared_journey_tokens table if not exists
    op.execute("""
    CREATE TABLE IF NOT EXISTS shared_journey_tokens (
        id VARCHAR(36) PRIMARY KEY,
        journey_id VARCHAR(36) NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
        user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP WITH TIME ZONE,
        is_revoked BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    op.execute("""
    CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_wardrobe_outfits_user_id ON wardrobe_outfits(user_id);
    CREATE INDEX IF NOT EXISTS idx_presence_goals_user_id ON presence_goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_presence_dna_user_id ON presence_dna(user_id);
    CREATE INDEX IF NOT EXISTS idx_shared_journey_tokens_token ON shared_journey_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_shared_journey_tokens_journey_id ON shared_journey_tokens(journey_id);
    """)

def downgrade() -> None:
    op.drop_table('shared_journey_tokens', if_exists=True)
    op.drop_table('presence_dna', if_exists=True)
    op.drop_table('presence_goals', if_exists=True)
    op.drop_table('wardrobe_outfits', if_exists=True)
    op.drop_table('wardrobe_items', if_exists=True)
