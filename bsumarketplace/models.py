from datetime import datetime
from bsumarketplace import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    sr_code = db.Column(db.String(20), unique=True, nullable=False)
    program = db.Column(db.String(20), nullable=False)  # Removed unique constraint
    password = db.Column(db.String(60), nullable=False)  # Increased length

    def __repr__(self):
        return f"User('{self.name}', '{self.email}', '{self.sr_code}', '{self.program}')"

    # name email program sr code password