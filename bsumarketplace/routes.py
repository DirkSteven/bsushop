from flask import render_template, url_for, flash, redirect, request, session, g, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from bsumarketplace import app, db, bcrypt
from bsumarketplace.forms import RegistrationForm, LoginForm
from bsumarketplace.models import User, Product, Category, ProductVariant, Cart, Order
from datetime import datetime
from sqlalchemy.exc import IntegrityError


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

    # Render the template with the fetched data
    return render_template('index.html',
                           uniform_products=uniform_products,
                           univ_merch_products=univ_merch_products,
                           org_merch_products=org_merch_products,
                           uniform_variants=uniform_variants,
                           univ_merch_variants=univ_merch_variants,
                           org_merch_variants=org_merch_variants, is_user_logged_in=is_user_logged_in)


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
            login_user(user)
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
    print(user_info)
    return jsonify(user_info)


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'POST':
        logout_user()
        flash('You have been logged out', 'info')
        return jsonify({'message': 'Logout successful'})
    else:
        return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(name=form.name.data, email=form.email.data, password=hashed_password,
                    program=form.program.data, sr_code=form.sr_code.data)

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
    existing_cart_item = Cart.query.filter_by(user_id=user_id, product_id=data['product_id'], selected_size=selected_size).first()

    if existing_cart_item:
        # Update the quantity if the item already exists
        existing_cart_item.quantity += data['quantity']
        db.session.commit()
        print("Item quantity updated in the cart:", existing_cart_item)
    else:
        # Add the selected product to the user's cart along with the selected size
        cart_item = Cart(user_id=user_id, product_id=data['product_id'], quantity=data['quantity'], selected_size=selected_size)
        db.session.add(cart_item)

        try:
            db.session.commit()
            print("Item added to the cart:", cart_item)
        except IntegrityError:
            # Handle IntegrityError in case of concurrent requests trying to add the same item simultaneously
            db.session.rollback()
            print("IntegrityError: Item already exists in the cart for the current user.")

    return jsonify({'message': 'Added to cart successfully'})



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
    user_cart = db.session.query(Cart, Product). \
        filter(Cart.user_id == current_user.id). \
        filter(Cart.product_id == Product.id).all()

    cart_items = []
    for cart, product in user_cart:
        cart_items.append({
            'product_id': cart.product_id,
            'quantity': cart.quantity,
            'date_added': cart.date_added.strftime("%Y-%m-%d %H:%M:%S"),
            'size': cart.selected_size,
            'name': product.name,
            'image_url': product.image_url,
            'price': product.price
        })

    return jsonify({'cartItems': cart_items})


@app.route('/get_variant_data/<int:product_id>', methods=['GET'])
def get_variant_data(product_id):
    variants = ProductVariant.query.filter_by(product_id=product_id).all()
    variant_data = [{'size': variant.size, 'stock': variant.stock} for variant in variants]

    return jsonify(variant_data)


@app.route('/remove_from_cart', methods=['POST'])
@login_required
def remove_from_cart():
    data = request.get_json()

    product_name = data.get('productName')
    size = data.get('size')

    product = Product.query.filter_by(name=product_name).first()

    if product:
        product_id = product.id

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


@app.route('/buy_now', methods=['POST'])
@login_required
def buy_now():
    data = request.get_json()

    success = process_and_store_selected_products(current_user.id, data.get('selectedProducts', []))
    delete_cart_items(current_user.id, data.get('selectedProducts', []))

    if success:
        update_product_variant_stock(data.get('selectedProducts', []))
        return jsonify({'message': 'Selected products stored successfully'})
    else:
        return jsonify({'message': 'Failed to store selected products'})


def process_and_store_selected_products(user_id, selected_products):
    try:
        for product in selected_products:
            order = Order(
                user_id=user_id,
                product_id=get_product_id_by_title(product['title']),
                order_quantity=product['quantity'],
                order_size=product['size'],
                order_total=calculate_order_total(product['title'], product['quantity'])
            )

            db.session.add(order)
            print(order.order_size)

        db.session.commit()
        return True
    except Exception as e:
        print(f"Error processing and storing selected products: {str(e)}")
        db.session.rollback()
        return False


def update_product_variant_stock(selected_products):
    try:
        for product in selected_products:
            product_id = get_product_id_by_title(product['title'])
            size = product['size']
            quantity = product['quantity']

            product_variant = ProductVariant.query.filter_by(product_id=product_id, size=size).first()

            if product_variant:
                new_stock = max(0, product_variant.stock - quantity)
                product_variant.stock = new_stock

        db.session.commit()
    except Exception as e:
        print(f"Error updating product variant stock: {str(e)}")
        db.session.rollback()


def get_product_id_by_title(product_title):
    product = Product.query.filter_by(name=product_title).first()
    if product:
        return product.id
    else:
        raise ValueError(f"Product with title '{product_title}' not found.")


def calculate_order_total(product_title, quantity):
    product = Product.query.filter_by(name=product_title).first()
    if product:
        return product.price * quantity
    else:
        raise ValueError(f"Product with title '{product_title}' not found.")


def delete_cart_items(user_id, selected_products):
    try:
        for product in selected_products:
            product_id = get_product_id_by_title(product['title'])
            size = product['size']

            cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id, selected_size=size).first()

            if cart_item:
                db.session.delete(cart_item)

        db.session.commit()
    except Exception as e:
        print(f"Error deleting cart items: {str(e)}")
        db.session.rollback()


@app.route('/get_orders', methods=['GET'])
@login_required
def get_orders():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Please Login'}), 400
    try:
        user_orders = Order.query.filter_by(user_id=current_user.id).all()
        order_count = len(user_orders)
        orders_data = []
        for order in user_orders:
            product = Product.query.get(order.product_id)
            orders_data.append({
                'product_name': product.name,
                'order_quantity': order.order_quantity,
                'order_size': order.order_size,
                'order_total': float(order.order_total),  # Convert to float for JSON serialization
                'date_purchase': order.date_purchase.strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify({'orders': orders_data, 'orderCount': order_count})

    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({'error': 'Failed to fetch orders'}), 500  # 500 Internal Server Error
