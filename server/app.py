from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime



from models import db, Runner, FutureRuns, CurrentConditioning, PersonalRecords, RunnerGoals

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

@app.route('/current_conditioning', methods=['POST'])
def current_conditioning():
    data = request.get_json()
    existing_record = CurrentConditioning.query.filter_by(runner_id=data['runnerId']).first()

    if existing_record:
        existing_record.runner_age = data['runnerAge']
        existing_record.years_running = data['yearsRunning']
        existing_record.current_weekly_miles = data['currentWeeklyMiles']
        db.session.commit()
        return jsonify({"message": "Current Conditioning updated successfully"})
    else:
        new_record = CurrentConditioning(runner_id=data['runnerId'], 
                                               runner_age=data['runnerAge'], 
                                               years_running=data['yearsRunning'], 
                                               current_weekly_miles=data['currentWeeklyMiles']
                                               )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({"message": "Current Conditioning added successfully"})

@app.route('/personal_records', methods=['POST'])
def personal_records():
    data = request.get_json()
    existing_record = PersonalRecords.query.filter_by(runner_id=data['runnerId']).first()

    if existing_record:
        existing_record.five_k_record=data['fivekRecord']
        existing_record.ten_k_record=data['tenkRecord']
        existing_record.half_marathon_record=data['halfMarathonRecord']
        existing_record.marathon_record=data['marathonRecord']
        db.session.commit()
        return jsonify({"message": "Personal Records updated successfully"})
    else:
        new_record = PersonalRecords(runner_id=data['runnerId'], 
                                       five_k_record=data['fivekRecord'], 
                                       ten_k_record=data['tenkRecord'], 
                                       half_marathon_record=data['halfMarathonRecord'], 
                                       marathon_record=data['marathonRecord']
                                       )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({"message": "Personal Records added successfully"})

@app.route('/runner_goals', methods=['POST'])
def runner_goals():
    data = request.get_json()

    race_date_str = data.get('raceDate', None)
    race_date = None
    if race_date_str:
        try: 
            race_date = datetime.strptime(race_date_str, '%Y-%m-%d').date()
        except Exception as e:
            print(f"Error fetching runs: {str(e)}")
            return jsonify({"error": "Invalid date format"}), 400

    existing_record = RunnerGoals.query.filter_by(runner_id=data['runnerId']).first()

    if existing_record:
        existing_record.race_training=data['raceTraining']
        existing_record.base_building=data['baseBuilding']
        existing_record.weekly_mileage=data['weeklyMileage']
        existing_record.weekly_sessions=data['weeklySessions']
        existing_record.weight_training=data['weightTraining']
        existing_record.cross_training=data['crossTraining']
        existing_record.race_date=race_date
        db.session.commit()
        return jsonify({"message": "Runner Goals updated successfully"})
    else:
        new_record = RunnerGoals(runner_id=data['runnerId'], 
                               race_training=data['raceTraining'], 
                               base_building=data['baseBuilding'], 
                               weekly_mileage=data['weeklyMileage'], 
                               weekly_sessions=data['weeklySessions'], 
                               weight_training=data['weightTraining'], 
                               cross_training=data['crossTraining'], 
                               race_date=race_date
                               )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({"message": "Runner Goals added successfully"})


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
    return jsonify({"user": {"id": current_user.id, "name": current_user.name, "username": current_user.username}})


@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5555, debug=True)