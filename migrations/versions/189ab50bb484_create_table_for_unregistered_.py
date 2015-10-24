"""Create table for unregistered collaborators

Revision ID: 189ab50bb484
Revises: f1292b5a6a5
Create Date: 2015-08-04 17:35:28.103904

"""

# revision identifiers, used by Alembic.
revision = '189ab50bb484'
down_revision = 'f1292b5a6a5'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('unregistered_collaborators',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('screenplay_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['screenplay_id'], ['screenplays.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('unregistered_collaborators')
    ### end Alembic commands ###