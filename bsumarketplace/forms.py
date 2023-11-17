from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from bsumarketplace.models import User

class RegistrationForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=25)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    program = StringField('Program', validators=[DataRequired(), Length(min=2, max=25)])
    sr_code = StringField('SR-Code', validators=[DataRequired(), Length(min=3, max=8)])
    submit = SubmitField('Sign Up')

    def validate_name(self, field):
        user = User.query.filter_by(name=self.name.data).first()
        if user:
            raise ValidationError('Name Already Exists')

    def validate_email(self, field):
        user = User.query.filter_by(email=self.email.data).first()
        if user:
            raise ValidationError('Email Already Exists')

    def validate_sr_code(self, field):
        user = User.query.filter_by(sr_code=self.sr_code.data).first()
        if user:
            raise ValidationError('SR-Code Already Exists')

class LoginForm (FlaskForm):
    password = PasswordField('Password',
                            validators=[DataRequired()])
    sr_code = StringField('Program', 
                           validators=[DataRequired(), Length(min=3, max = 8)])
    submit = SubmitField ('Login')


    