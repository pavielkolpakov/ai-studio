"""create_conversations_table

Revision ID: 8a39b8f4743e
Revises: 
Create Date: 2026-04-09 19:35:56.548823

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8a39b8f4743e'
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'conversations',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('session_id', sa.Text(), nullable=False),
        sa.Column('messages', postgresql.JSONB(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_conversations_session_id'), 'conversations', ['session_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_conversations_session_id'), table_name='conversations')
    op.drop_table('conversations')
