"""Added run_date column to FutureRuns model

Revision ID: 99b0bf531ba4
Revises: a55060dfbecd
Create Date: 2024-07-17 10:37:43.185453

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99b0bf531ba4'
down_revision = 'a55060dfbecd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('future_runs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('run_date', sa.Date(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('future_runs', schema=None) as batch_op:
        batch_op.drop_column('run_date')

    # ### end Alembic commands ###
