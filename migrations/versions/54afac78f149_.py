"""Added blog table

Revision ID: 54afac78f149
Revises: 8da251ea0d9
Create Date: 2015-04-08 11:17:56.081209

"""

# revision identifiers, used by Alembic.
revision = '54afac78f149'
down_revision = '8da251ea0d9'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blog',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('data', sa.Text(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('blog')
    ### end Alembic commands ###