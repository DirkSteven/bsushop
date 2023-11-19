from flask import render_template, url_for, flash, redirect, request, session, g, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from bsumarketplace import app, db, bcrypt
from bsumarketplace.forms import RegistrationForm, LoginForm
from bsumarketplace.models import User, Product, Category, ProductVariant

@app.route('/')
@app.route('/index')
def index():
    # Fetch categories from the database
    uniform_category = Category.query.filter_by(name='Uniform').first()
    univ_merch_category = Category.query.filter_by(name='UnivMerch').first()
    org_merch_category = Category.query.filter_by(name='OrgMerch').first()

    # Fetch products for each category
    uniform_products = Product.query.filter_by(category=uniform_category).all()
    univ_merch_products = Product.query.filter_by(category=univ_merch_category).all()
    org_merch_products = Product.query.filter_by(category=org_merch_category).all()

    # Fetch product variants for each product
    uniform_variants = {}
    for product in uniform_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        uniform_variants[product.id] = variants

    univ_merch_variants = {}
    for product in univ_merch_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        univ_merch_variants[product.id] = variants

    org_merch_variants = {}
    for product in org_merch_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        org_merch_variants[product.id] = variants

    return render_template('index.html',
                           uniform_products=uniform_products,
                           univ_merch_products=univ_merch_products,
                           org_merch_products=org_merch_products,
                           uniform_variants=uniform_variants,
                           univ_merch_variants=univ_merch_variants,
                           org_merch_variants=org_merch_variants)



@app.route('/product-info/<int>product.id')
def product-info():
    # Fetch categories from the database
    uniform_category = Category.query.filter_by(name='Uniform').first()
    univ_merch_category = Category.query.filter_by(name='UnivMerch').first()
    org_merch_category = Category.query.filter_by(name='OrgMerch').first()

    # Fetch products for each category
    uniform_products = Product.query.filter_by(category=uniform_category).all()
    univ_merch_products = Product.query.filter_by(category=univ_merch_category).all()
    org_merch_products = Product.query.filter_by(category=org_merch_category).all()

    # Fetch product variants for each product
    uniform_variants = {}
    for product in uniform_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        uniform_variants[product.id] = variants

    univ_merch_variants = {}
    for product in univ_merch_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        univ_merch_variants[product.id] = variants

    org_merch_variants = {}
    for product in org_merch_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        org_merch_variants[product.id] = variants

    return render_template('index.html',
                           uniform_products=uniform_products,
                           univ_merch_products=univ_merch_products,
                           org_merch_products=org_merch_products,
                           uniform_variants=uniform_variants,
                           univ_merch_variants=univ_merch_variants,
                           org_merch_variants=org_merch_variants)


@app.route('/login', methods=['GET', 'POST'])
def login():
    # Check if the user is already logged in
    if current_user.is_authenticated:
        flash('User Already Logged In', 'info')
        return redirect(url_for('index'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(sr_code=form.sr_code.data).first()

        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user)  # Log in the user using Flask-Login
            flash('Login Successful', 'success')
            return redirect(url_for('index'))
        else:
            flash('Login Failed. Please check your SR-Code and password', 'danger')

    return render_template('login.html', title='Login', form=form)

@app.route('/logout')
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():

        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(name=form.name.data, email=form.email.data, password=hashed_password, program=form.program.data, sr_code=form.sr_code.data)
        
        # For Debug
        print("Form validated successfully")
        print(f'Name: {form.name.data}')
        print(f'Email: {form.email.data}')
        print(f'Program: {form.program.data}')
        print(f'SR-Code: {form.sr_code.data}')

        db.session.add(user)
        db.session.commit()
        flash(f'Account Created for {form.name.data}!')
        return redirect(url_for('login'))
    else:
        # For Debug
        print("Form validation failed")
        print(form.errors)

    return render_template('signup.html', title='Register', form=form)

