from flask import Flask, request, jsonify, session, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_cors import CORS
import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps

app = Flask(__name__)
#CORS(app, resources={r"/auth/*": {"origins": "https://localhost:5000"}})  # Allow frontend to communicate with backend
CORS(app)
load_dotenv()

# PostgreSQL Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:admin@localhost/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "f3e1a5c8b72d4d8d9e5a3b6c2f7e1d5a0b8c9a7f6e3d4c2f1e0a5b6d9c8e7f1"
#app.config["JWT_TOKEN_LOCATION"] = ['headers', 'query_string']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phonenumber = db.Column(db.String(15), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)

    def __init__(self, username, email, password, phonenumber):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        self.phonenumber = phonenumber

#Portfolio Model
class Portfolio(db.Model):
    portfolio_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    real_estate_value = db.Column(db.Integer, nullable=False)
    stock_value = db.Column(db.Integer, nullable=False)
    total_value = db.Column(db.Integer, nullable=False)
    profit_loss = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    #updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = db.relationship('User', backref=db.backref('portfolio', lazy=True))

    def __init__(self, user_id, real_estate_value, stock_value, total_value, profit_loss):
        self.user_id = user_id
        self.real_estate_value = real_estate_value
        self.stock_value = stock_value
        self.total_value = total_value
        self.profit_loss = profit_loss

#Financial Standing Table
class FST(db.Model):
    fst_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    jam_per = db.Column(db.Integer, nullable=True)
    world_per = db.Column(db.Integer, nullable=True)
    jam_rank = db.Column(db.Integer, nullable=True)
    world_rank = db.Column(db.Integer, nullable=True)
    user = db.relationship('User', backref=db.backref('financial_standing', lazy=True))

    def __init__(self, user_id, jam_per, world_per, jam_rank, world_rank):
        self.user_id = user_id
        self.jam_per = jam_per
        self.jam_rank = jam_rank
        self.world_per = world_per
        self.world_rank = world_rank

# Create Tables
with app.app_context():
    db.create_all()

# def token_required(func):
#     @wraps(func)
#     def decorated(*args, **kwargs):
#         token = request.args.get('token')
#         if not token:
#             return jsonify({'Alert!':'Token is missing!'})
#         try: 
#             payload = jwt.decode(token, app.config['JWT_SECRET_KEY'])
#         except:
#             return jsonify({'Alert!': 'Invalid Token!'})
#     return decorated

# @app.route('/public')
# def public():
#     return 'For Public'

# User Registration
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phonenumber = data.get("phonenumber")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    new_user = User(username=username, email=email, password=password, phonenumber=phonenumber)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# User Login
@app.route("/auth/signin", methods=["POST"])
def signin():
     data = request.json
     email = data.get("email")
     password = data.get("password")

     user = User.query.filter_by(email=email).first()
     if not user or not bcrypt.check_password_hash(user.password_hash, password):
         return jsonify({"message": "Invalid credentials"}), 401
    
     access_token = create_access_token(identity=str(user.user_id) )
     return jsonify(access_token=access_token)

# #Submit Financial Information
# @app.route("/auth/submit", methods=["POST"])
# @jwt_required()
# def submit():
#     user_id = get_jwt_identity()
#     if not user_id:
#         return jsonify({'message': "User ID not found in token"}), 401
#     #user_id = 1

#     data = request.json
#     real_estate_value = data.get("realEstateValue")
#     stock_value = data.get("stockValue")
#     total_value = data.get("totalAssets")
#     profit_loss = data.get("liabilities")
#     jam_per = data.get("jamaicaPercentile")
#     world_per = data.get("worldPercentile")
#     jam_rank = data.get("jamaicaRank")
#     world_rank = data.get("worldRank")

#     new_portfolio = Portfolio(user_id=user_id, real_estate_value=real_estate_value, stock_value=stock_value, total_value=total_value, profit_loss=profit_loss)
#     db.session.add(new_portfolio)
#     db.session.commit()
#     new_fst = FST(user_id=user_id, jam_per=jam_per, world_per=world_per, jam_rank=jam_rank, world_rank=world_rank)
#     db.session.add(new_fst)
#     db.session.commit()

#     return jsonify({"message": "Successfully Submitted"}), 201

@app.route("/auth/submit", methods=["POST"])
@jwt_required()
def submit():
    print(request.headers)
    user_id = get_jwt_identity()
    print("This is the User ID: ", user_id)

    if not user_id:
        return jsonify({"message": "User ID not found in token"}), 401

    data = request.json
    if not data:
        return jsonify({"message": "Missing JSON body"}), 400

    required_fields = ["realEstateValue", "stockValue", "totalAssets", "liabilities", "jamaicaPercentile", "worldPercentile", "jamaicaRank", "worldRank"]

    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing field: {field}"}), 400

    try:
        # Check if user already has a portfolio entry
        existing_portfolio = Portfolio.query.filter_by(user_id=user_id).first()
        existing_fst = FST.query.filter_by(user_id=user_id).first()

        if existing_portfolio:
            # Update existing portfolio record
            existing_portfolio.real_estate_value = data["realEstateValue"]
            existing_portfolio.stock_value = data["stockValue"]
            existing_portfolio.total_value = data["totalAssets"]
            existing_portfolio.profit_loss = data["liabilities"]
        else:
            # Create new portfolio record if it doesn't exist
            new_portfolio = Portfolio(
                user_id=user_id,
                real_estate_value=data["realEstateValue"],
                stock_value=data["stockValue"],
                total_value=data["totalAssets"],
                profit_loss=data["liabilities"]
            )
            db.session.add(new_portfolio)

        if existing_fst:
            # Update existing FST record
            existing_fst.jam_per = data["jamaicaPercentile"]
            existing_fst.world_per = data["worldPercentile"]
            existing_fst.jam_rank = data["jamaicaRank"]
            existing_fst.world_rank = data["worldRank"]
        else:
            # Create new FST record if it doesn't exist
            new_fst = FST(
                user_id=user_id,
                jam_per=data["jamaicaPercentile"],
                world_per=data["worldPercentile"],
                jam_rank=data["jamaicaRank"],
                world_rank=data["worldRank"]
            )
            db.session.add(new_fst)

        db.session.commit()
        return jsonify({"message": "Successfully Submitted"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Database error", "error": str(e)}), 500


#Dashboard
@app.route("/auth/finance", methods=["GET", "POST"])
@jwt_required()
def finance():
    current_user_id = get_jwt_identity()  # Get the user ID from JWT token
    #current_user_id = 1
    
    # Fetch user portfolio data
    portfolio = Portfolio.query.filter_by(user_id=current_user_id).first()
    if not portfolio:
        return jsonify({"message": "Portfolio data not found"}), 404

    # Fetch user financial standing data
    financial_standing = FST.query.filter_by(user_id=current_user_id).first()
    if not financial_standing:
        return jsonify({"message": "Financial standing data not found"}), 404

    # Prepare the data to send back
    dashboard_data = {
        "clientPortfolio": {
            "realEstateValue": portfolio.real_estate_value,
            "stockValue": portfolio.stock_value,
            "totalAssets": portfolio.total_value,
            "liabilities": portfolio.profit_loss,  # Assuming 'profit_loss' refers to liabilities for now
        },
        "financialStanding": {
            "jamaicaPercentile": financial_standing.jam_per,
            "worldPercentile": financial_standing.world_per,
            "jamaicaRank": financial_standing.jam_rank,
            "worldRank": financial_standing.world_rank,
        }
    }

    return jsonify(dashboard_data), 200

@app.route("/auth/display", methods=["GET"])
@jwt_required()
def display():
    current_user_id = get_jwt_identity()

    user = User.query.filter_by(user_id=current_user_id).first()
    if not user:
        return jsonify({"message": "User Not Found"}), 400

    update_data = {
        "email": user.email, 
        "username": user.username, 
        "phonenumber": user.phonenumber
    }

    return jsonify(update_data), 200

# User Registration
@app.route("/auth/update", methods=["POST"])
@jwt_required()
def update():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=current_user_id).first()
    if not user: 
        return jsonify({"message": "User Not Found"}), 400

    data = request.json
    password = data.get("currentPassword")
    print("This is Password: ", password)
    if bcrypt.check_password_hash(user.password_hash, str(password)):
        print("Entered Current Password")
        newPassword = data.get("newPassword")
        user.username = data.get("username")
        user.email = data.get("email")
        user.phonenumber = data.get("phonenumber")
        user.password_hash = bcrypt.generate_password_hash(newPassword).decode("utf-8")
    else:
        user.username = data.get("username")
        user.email = data.get("email")
        user.phonenumber = data.get("phonenumber")

    db.session.commit()

    return jsonify({"message": "User Information Updated Successfully"}), 201

  

# Protected Route Example
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify({"message": "You have accessed a protected route"}), 200

if __name__ == "__main__":
    app.run(debug=True)

