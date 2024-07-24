"""empty message

Revision ID: 61fd520cfc74
Revises: f2eee63cf004
Create Date: 2024-07-24 15:24:41.522731

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '61fd520cfc74'
down_revision = 'f2eee63cf004'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('plan_overview',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('runner_id', sa.Integer(), nullable=True),
    sa.Column('plan_intro', sa.String(), nullable=True),
    sa.Column('weekly_schedule', sa.String(), nullable=True),
    sa.Column('weekly_mileage', sa.String(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['runner_id'], ['runners.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('runs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('runner_id', sa.Integer(), nullable=True),
    sa.Column('run_type', sa.String(), nullable=True),
    sa.Column('run_details', sa.String(), nullable=True),
    sa.Column('is_complete', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('total_miles', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['runner_id'], ['runners.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('future_runs')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('future_runs',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('runner_id', sa.INTEGER(), nullable=True),
    sa.Column('distance', sa.INTEGER(), nullable=True),
    sa.Column('pace', sa.VARCHAR(), nullable=True),
    sa.Column('is_complete', sa.BOOLEAN(), nullable=True),
    sa.Column('created_at', sa.DATETIME(), nullable=True),
    sa.Column('run_date', sa.DATE(), nullable=True),
    sa.ForeignKeyConstraint(['runner_id'], ['runners.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('runs')
    op.drop_table('plan_overview')
    # ### end Alembic commands ###