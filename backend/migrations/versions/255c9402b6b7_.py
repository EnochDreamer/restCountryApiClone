"""empty message

Revision ID: 255c9402b6b7
Revises: cc086703975e
Create Date: 2023-04-11 09:25:28.536608

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '255c9402b6b7'
down_revision = 'cc086703975e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('my_user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('user_name')
    )
    op.drop_table('user')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('password_hash', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='user_pkey'),
    sa.UniqueConstraint('email', name='user_email_key'),
    sa.UniqueConstraint('user_name', name='user_user_name_key')
    )
    op.drop_table('my_user')
    # ### end Alembic commands ###