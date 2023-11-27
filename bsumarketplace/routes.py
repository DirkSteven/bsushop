from flask import render_template, url_for, flash, redirect, request, session, g, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy import text  # Import the text function
from bsumarketplace import app, db, bcrypt
from bsumarketplace.forms import RegistrationForm, LoginForm
from bsumarketplace.models import User, Product, Category, ProductVariant, Cart, Order
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash  # Import these functions

@app.route('/')
@app.route('/index')
def index():
    is_user_logged_in = current_user.is_authenticated

    # Fetch categories from the database
    with db.engine.connect() as connection:
        uniform_category = connection.execute(text("SELECT * FROM category WHERE name = 'Uniform'")).first()
        univ_merch_category = connection.execute(text("SELECT * FROM category WHERE name = 'UnivMerch'")).first()
        org_merch_category = connection.execute(text("SELECT * FROM category WHERE name = 'OrgMerch'")).first()

        # Fetch products for each category
        uniform_products = connection.execute(text("SELECT * FROM product WHERE category_id = :category_id"), {"category_id": uniform_category.id}).fetchall()
        univ_merch_products = connection.execute(text("SELECT * FROM product WHERE category_id = :category_id"), {"category_id": univ_merch_category.id}).fetchall()
        org_merch_products = connection.execute(text("SELECT * FROM product WHERE category_id = :category_id"), {"category_id": org_merch_category.id}).fetchall()

        # Fetch product variants for each product
        uniform_variants = {}
        for product in uniform_products:
            variants = connection.execute(text("SELECT * FROM product_variant WHERE product_id = :product_id"), {"product_id": product.id}).fetchall()
            uniform_variants[product.id] = [{'size': variant.size, 'stock': variant.stock} for variant in variants]

        univ_merch_variants = {}
        for product in univ_merch_products:
            variants = connection.execute(text("SELECT * FROM product_variant WHERE product_id = :product_id"), {"product_id": product.id}).fetchall()
            univ_merch_variants[product.id] = [{'size': variant.size, 'stock': variant.stock} for variant in variants]

        org_merch_variants = {}
        for product in org_merch_products:
            variants = connection.execute(text("SELECT * FROM product_variant WHERE product_id = :product_id"), {"product_id": product.id}).fetchall()
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
    # Fetch user information using raw SQL
    with db.engine.connect() as connection:
        query = text("SELECT id, name, email, program, sr_code FROM user WHERE id = :user_id")
        result = connection.execute(query, {"user_id": current_user.id}).first()

    user_info = {
        'name': result.name,
        'email': result.email,
        'program': result.program,
        'sr_code': result.sr_code,
        'id': result.id,
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
    # Fetch additional data using raw SQL (replace this with your actual data retrieval logic)
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

    # Add the selected product to the user's cart along with the selected size using raw SQL
    with db.engine.connect() as connection:
        # Check if the item already exists in the cart
        existing_cart_item = connection.execute(
            text("SELECT * FROM cart WHERE user_id = :user_id AND product_id = :product_id AND selected_size = :selected_size"),
            {"user_id": user_id, "product_id": data['product_id'], "selected_size": selected_size}
        ).fetchone()

        if existing_cart_item:
            # Update the quantity if the item already exists
            connection.execute(
                text("UPDATE cart SET quantity = quantity + :quantity WHERE id = :cart_id"),
                {"quantity": data['quantity'], "cart_id": existing_cart_item.id}
            )
            print("Item quantity updated in the cart:", existing_cart_item)
        else:
            # Add the selected product to the user's cart along with the selected size
            connection.execute(
                text("INSERT INTO cart (user_id, product_id, quantity, selected_size) VALUES (:user_id, :product_id, :quantity, :selected_size)"),
                {"user_id": user_id, "product_id": data['product_id'], "quantity": data['quantity'], "selected_size": selected_size}
            )
            print("Item added to the cart successfully.")

    return jsonify({'message': 'Added to cart successfully'})



@app.route('/check_login_status', methods=['GET'])
def check_login_status():
    # Check if the user is logged in using raw SQL
    with db.engine.connect() as connection:
        query = text("SELECT id, name FROM user WHERE id = :user_id")
        result = connection.execute(query, {"user_id": current_user.id}).fetchone()

    if result:
        print(f'User is logged in. User ID: {result.id}, Name: {result.name}')
        logged_in = True
    else:
        print('User is not logged in')
        logged_in = False
    return jsonify({'logged_in': logged_in, 'user_id': result.id if logged_in else None})

@app.route('/display_flash', methods=['POST'])
def display_flash():
    data = request.get_json()
    flash(data['message'], data['category'])
    return jsonify({'message': 'Flash message displayed successfully'})

@app.route('/get_user_cart')
@login_required
def get_user_cart():
    # Fetch user cart items using raw SQL
    with db.engine.connect() as connection:
        query = text("SELECT c.product_id, c.quantity, c.date_added, c.selected_size, p.name, p.image_url, p.price "
                     "FROM cart c JOIN product p ON c.product_id = p.id WHERE c.user_id = :user_id")
        results = connection.execute(query, {"user_id": current_user.id}).fetchall()

    cart_items = []
    for result in results:
        cart_items.append({
            'product_id': result.product_id,
            'quantity': result.quantity,
            'date_added': result.date_added.strftime("%Y-%m-%d %H:%M:%S"),
            'size': result.selected_size,
            'name': result.name,
            'image_url': result.image_url,
            'price': result.price
        })

    return jsonify({'cartItems': cart_items})


@app.route('/get_variant_data/<int:product_id>', methods=['GET'])
def get_variant_data(product_id):
    # Fetch variant data using raw SQL
    with db.engine.connect() as connection:
        query = text("SELECT size, stock FROM product_variant WHERE product_id = :product_id")
        variants = connection.execute(query, {"product_id": product_id}).fetchall()

    variant_data = [{'size': variant.size, 'stock': variant.stock} for variant in variants]
    return jsonify(variant_data)

@app.route('/remove_from_cart', methods=['POST'])
@login_required
def remove_from_cart():
    data = request.get_json()

    product_name = data.get('productName')
    size = data.get('size')

    # Fetch product and cart item using raw SQL
    with db.engine.connect() as connection:
        product_query = text("SELECT id FROM product WHERE name = :product_name")
        product_id = connection.execute(product_query, {"product_name": product_name}).scalar()

        cart_item_query = text("SELECT id FROM cart WHERE user_id = :user_id AND product_id = :product_id AND selected_size = :selected_size")
        cart_item_id = connection.execute(cart_item_query, {"user_id": current_user.id, "product_id": product_id, "selected_size": size}).scalar()

        if cart_item_id:
            # Delete the cart item if it exists
            connection.execute(text("DELETE FROM cart WHERE id = :cart_item_id"), {"cart_item_id": cart_item_id})
            print(f"Item removed from the cart and database. Product Name: {product_name}, Size: {size}")
            return jsonify({'success': True, 'message': 'Item removed from the cart and database successfully'})
        else:
            print(f"Item not found in the cart or database. Product Name: {product_name}, Size: {size}")
            return jsonify({'success': False, 'message': 'Item not found in the cart or database'})

@app.route('/buy_now', methods=['POST'])
@login_required
def buy_now():
    data = request.get_json()

    # Process and store selected products using raw SQL
    success = process_and_store_selected_products(current_user.id, data.get('selectedProducts', []))

    if success:
        # Update product variant stock and delete cart items using raw SQL
        update_product_variant_stock(data.get('selectedProducts', []))
        delete_cart_items(current_user.id, data.get('selectedProducts', []))

        return jsonify({'message': 'Selected products stored and processed successfully'})
    else:
        return jsonify({'message': 'Failed to store and process selected products'})

# Helper functions using raw SQL
def process_and_store_selected_products(user_id, selected_products):
    try:
        with db.engine.connect() as connection:
            for product in selected_products:
                order_query = text("INSERT INTO order (user_id, product_id, order_quantity, order_size, order_total) "
                                   "VALUES (:user_id, :product_id, :order_quantity, :order_size, :order_total)")
                connection.execute(order_query, {
                    "user_id": user_id,
                    "product_id": get_product_id_by_title(connection, product['title']),
                    "order_quantity": product['quantity'],
                    "order_size": product['size'],
                    "order_total": calculate_order_total(connection, product['title'], product['quantity'])
                })

        return True
    except Exception as e:
        print(f"Error processing and storing selected products: {str(e)}")
        return False

def update_product_variant_stock(selected_products):
    try:
        with db.engine.connect() as connection:
            for product in selected_products:
                product_id = get_product_id_by_title(connection, product['title'])
                size = product['size']
                quantity = product['quantity']

                product_variant_query = text("SELECT stock FROM product_variant WHERE product_id = :product_id AND size = :size")
                product_variant_stock = connection.execute(product_variant_query, {"product_id": product_id, "size": size}).scalar()

                if product_variant_stock is not None:
                    new_stock = max(0, product_variant_stock - quantity)

                    update_stock_query = text("UPDATE product_variant SET stock = :new_stock "
                                              "WHERE product_id = :product_id AND size = :size")
                    connection.execute(update_stock_query, {"new_stock": new_stock, "product_id": product_id, "size": size})

    except Exception as e:
        print(f"Error updating product variant stock: {str(e)}")

def get_product_id_by_title(connection, product_title):
    product_query = text("SELECT id FROM product WHERE name = :product_title")
    product_id = connection.execute(product_query, {"product_title": product_title}).scalar()

    if product_id:
        return product_id
    else:
        raise ValueError(f"Product with title '{product_title}' not found.")

def calculate_order_total(connection, product_title, quantity):
    product_query = text("SELECT price FROM product WHERE name = :product_title")
    product_price = connection.execute(product_query, {"product_title": product_title}).scalar()

    if product_price is not None:
        return product_price * quantity
    else:
        raise ValueError(f"Product with title '{product_title}' not found.")

def delete_cart_items(user_id, selected_products):
    try:
        with db.engine.connect() as connection:
            for product in selected_products:
                product_id = get_product_id_by_title(connection, product['title'])
                size = product['size']

                cart_item_query = text("DELETE FROM cart WHERE user_id = :user_id AND product_id = :product_id AND selected_size = :size")
                connection.execute(cart_item_query, {"user_id": user_id, "product_id": product_id, "size": size})

    except Exception as e:
        print(f"Error deleting cart items: {str(e)}")


@app.route('/get_orders', methods=['GET'])
@login_required
def get_orders():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Please Login'}), 400

    try:
        # Fetch user orders using raw SQL
        with db.engine.connect() as connection:
            query = text("SELECT o.order_quantity, o.order_size, o.order_total, o.date_purchase, p.name as product_name "
                         "FROM orders o "
                         "JOIN product p ON o.product_id = p.id "
                         "WHERE o.user_id = :user_id")
            user_orders = connection.execute(query, {"user_id": current_user.id}).fetchall()

        order_count = len(user_orders)
        orders_data = []

        for order in user_orders:
            orders_data.append({
                'product_name': order.product_name,
                'order_quantity': order.order_quantity,
                'order_size': order.order_size,
                'order_total': float(order.order_total),  # Convert to float for JSON serialization
                'date_purchase': order.date_purchase.strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify({'orders': orders_data, 'orderCount': order_count})

    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({'error': 'Failed to fetch orders'}), 500  # 500 Internal Server Error