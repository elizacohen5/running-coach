from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime



from models import db, Runner, FutureRuns

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

CORS(app, supports_credentials=True)  # set up cors

@app.route('/runs/<int:id>', methods=['GET'])
def get_all_runs(id):
    try:
        runner = Runner.query.filter(Runner.id == id).first()
        runs = []
        for run in runner.runs:
            run_dict = run.to_dict()
            runs.append(run_dict)
        return make_response(jsonify(runs), 200)
    except Exception as e:
        print(f"Error fetching runs: {str(e)}")
        return make_response(jsonify({'error': 'Failed to fetch runs'}), 500)
    

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Runner.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            # 'exp': datetime.datetime.now() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({"success": True, "token": token})
    return jsonify({"success": False, "message": "Invalid username or password"})


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = Runner(name=data['name'], username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Runner registered successfully"})



@app.route('/home', methods=['GET'])
def dashboard():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing!"}), 401
    try: 
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = Runner.query.get(data['user_id'])
    except Exception as e:
        print(e)
        return jsonify({"message": "Token is invalid!"}), 401
    return jsonify({"message": f"Welcome to your dashboard, {current_user.name}!"})


@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5555, debug=True)