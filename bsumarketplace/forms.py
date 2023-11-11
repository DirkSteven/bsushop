from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email

class RegistrationForm (FlaskForm):
    username = StringField('Username', 
                           validators=[DataRequired(), Length(min=2, max = 25)])
    email = StringField('Email', 
                           validators=[DataRequired(), Email()])
    password = PasswordField('Password',
                            validators=[DataRequired()])
    program = StringField ('Program', 
                           validators=[DataRequired(), Length(min=2, max = 25)])
    sr_code = StringField('Program', 
                           validators=[DataRequired(), Length(min=3, max = 8)])
    submit = SubmitField ('Sign_Up')

class LoginForm (FlaskForm):
    password = PasswordField('Password',
                            validators=[DataRequired()])
    sr_code = StringField('Program', 
                           validators=[DataRequired(), Length(min=3, max = 8)])
    submit = SubmitField ('Login')


    