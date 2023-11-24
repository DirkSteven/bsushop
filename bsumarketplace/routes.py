

from flask import render_template, url_for, flash, redirect, request, session, g, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from bsumarketplace import app, db, bcrypt
from bsumarketplace.forms import RegistrationForm, LoginForm
from bsumarketplace.models import User, Product, Category, ProductVariant, Cart

@app.route('/')
@app.route('/index')
def index():

    is_user_logged_in = current_user.is_authenticated
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
        uniform_variants[product.id] = [{'size': variant.size, 'stock': variant.stock} for variant in variants]

    univ_merch_variants = {}
    for product in univ_merch_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        univ_merch_variants[product.id] = [{'size': variant.size, 'stock': variant.stock} for variant in variants]

    org_merch_variants = {}
    for product in org_merch_products:
        variants = ProductVariant.query.filter_by(product=product).all()
        org_merch_variants[product.id] = [{'size': variant.size, 'stock': variant.stock} for variant in variants]


      #Print stocks and sizes for each product in the console
    # for product_id, variants in uniform_variants.items():
    #      product = Product.query.get(product_id)
    #      print(f"Uniform Product: {product.name}")
    #      for variant in variants:
    #          print(f"Size: {variant['size']}, Stock: {variant['stock']}")

    # for product_id, variants in univ_merch_variants.items():
    #      product = Product.query.get(product_id)
    #      print(f"UnivMerch Product: {product.name}")
    #      for variant in variants:
    #          print(f"Size: {variant['size']}, Stock: {variant['stock']}")

    # for product_id, variants in org_merch_variants.items():
    #      product = Product.query.get(product_id)
    #      print(f"OrgMerch Product: {product.name}")
    #      for variant in variants:
    #          print(f"Size: {variant['size']}, Stock: {variant['stock']}")

    #  Render the template with the fetched data
    return render_template('index.html',
                           uniform_products=uniform_products,
                           univ_merch_products=univ_merch_products,
                           org_merch_products=org_merch_products,
                           uniform_variants=uniform_variants,
                           univ_merch_variants=univ_merch_variants,
                           org_merch_variants=org_merch_variants, is_user_logged_in = is_user_logged_in)



@app.route('/login', methods=['GET', 'POST'])
def login():
    # Check if the user is already logged in
    if current_user.is_authenticated:
        print('User Already Logged In', 'info')
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


@app.route('/get_user_info', methods=['GET'])
@login_required
def get_user_info():
    user_info = {
        'name': current_user.name,
        'email': current_user.email,
        'program': current_user.program,
        'sr_code': current_user.sr_code,
        'id': current_user.id,
    }
    print (user_info)
    return jsonify(user_info)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'POST':
        logout_user()
        flash('You have been logged out', 'info')
        return jsonify({'message': 'Logout successful'})
    else:
        # Handle GET request, e.g., redirect to the index page
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

@app.route('/get_additional_data/<int:product_id>', methods=['GET'])
def get_additional_data(product_id):
    # Example: Fetch additional data based on the product ID
    # You can customize this based on your application's requirements
    additional_data = {'example_key': 'example_value'}
    print(f"Request made to {request.url}")
    return jsonify(additional_data)


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()

    # Assuming the user is logged in, get the user ID from the current user
    user_id = current_user.id

    # Extract the selected size from the request data
    selected_size = data.get('selected_size', None)

    # Add the selected product to the user's cart along with the selected size
    cart_item = Cart(user_id=user_id, product_id=data['product_id'], quantity=data['quantity'], selected_size=selected_size)
    db.session.add(cart_item)
    print ("Item Added to Cart", cart_item)
    db.session.commit()

    return jsonify({'message': 'Added to cart successfully'})

@app.route('/buy_now', methods=['POST'])
def buy_now():
    # Example: Handle the "Buy Now" action based on the data received
    data = request.get_json()
    # Add logic to handle the "Buy Now" action (e.g., redirect to a checkout page)
    print('Buy Now:', data)
    return jsonify({'message': 'Buy Now successful'})


@app.route('/check_login_status', methods=['GET'])
def check_login_status():
    # Check if the user is logged in
    if current_user.is_authenticated:
        print(f'User is logged in. User ID: {current_user.id}, Name: {current_user.name}')
        logged_in = True
    else:
        print('User is not logged in')
        logged_in = False
    return jsonify({'logged_in': logged_in, 'user_id': current_user.id if logged_in else None})

@app.route('/display_flash', methods=['POST'])
def display_flash():
    data = request.get_json()
    flash(data['message'], data['category'])
    return jsonify({'message': 'Flash message displayed successfully'})

@app.route('/get_user_cart')
@login_required
def get_user_cart():
    user_cart = db.session.query(Cart, Product).\
        filter(Cart.user_id == current_user.id).\
        filter(Cart.product_id == Product.id).all()

    # Convert user_cart to a list of dictionaries for JSON serialization
    cart_items = []
    for cart, product in user_cart:
        cart_items.append({
            'product_id': cart.product_id,
            'quantity': cart.quantity,
            'date_added': cart.date_added.strftime("%Y-%m-%d %H:%M:%S"),
            'size': cart.selected_size,
            'name': product.name,
            'image_url': product.image_url,
            'price': product.price  # You can include other product details as needed
        })
    # print (cart_items)

    return jsonify({'cartItems': cart_items})






@app.route('/get_variant_data/<int:product_id>', methods=['GET'])
def get_variant_data(product_id):
    # Fetch variant data based on the product ID from the database
    # Return the data as a JSON response
    # Modify this based on your actual data structure
    variants = ProductVariant.query.filter_by(product_id=product_id).all()
    variant_data = [{'size': variant.size, 'stock': variant.stock} for variant in variants]
    # print (variant_data)
    return jsonify(variant_data)



@app.route('/remove_from_cart', methods=['POST'])
@login_required
def remove_from_cart():
    data = request.get_json()

    product_name = data.get('productName')
    size = data.get('size')

    # Find the product and get its ID
    product = Product.query.filter_by(name=product_name).first()

    if product:
        product_id = product.id

        # Find the cart item in the database and delete it
        cart_item = Cart.query.filter_by(user_id=current_user.id, product_id=product_id, selected_size=size).first()

        if cart_item:
            db.session.delete(cart_item)
            db.session.commit()
            print(f"Item removed from the cart and database. Product Name: {product_name}, Size: {size}")

            return jsonify({'success': True, 'message': 'Item removed from the cart and database successfully'})
        else:
            print(f"Item not found in the cart or database. Product Name: {product_name}, Size: {size}")
            return jsonify({'success': False, 'message': 'Item not found in the cart or database'})
    else:
        print(f"Product not found. Product Name: {product_name}")
        return jsonify({'success': False, 'message': 'Product not found'})
