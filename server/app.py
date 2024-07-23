from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime
from dotenv import load_dotenv
import os
import openai
from models import db, Runner, FutureRuns, CurrentConditioning, PersonalRecords, RunnerGoals

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.json.compact = False

# Set up openai key 
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

CORS(app, supports_credentials=True)  # set up cors

# Function to create training plan prompt
def generate_training_plan_prompt(runner):
    runner_age = runner.current_conditioning[0].runner_age
    years_running = runner.current_conditioning[0].years_running
    current_weekly_miles = runner.current_conditioning[0].current_weekly_miles
    five_k_record = runner.personal_records[0].five_k_record
    ten_k_record = runner.personal_records[0].ten_k_record
    half_marathon_record = runner.personal_records[0].half_marathon_record
    marathon_record = runner.personal_records[0].marathon_record
    race_training = "train for a race" if runner.runner_goals[0].race_training else "increase mileage"
    race = runner.runner_goals[0].race
    race_date = runner.runner_goals[0].race_date
    weekly_sessions = runner.runner_goals[0].weekly_sessions
    weight_training = "weight training" if runner.runner_goals[0].weight_training else "cross training"

    prompt = f"""
    I am {runner_age} years old and I have been running for {years_running} years. 
    I currently run about {current_weekly_miles} miles weekly. 
    My 5k record is {five_k_record} minutes, my 10k record is {ten_k_record} minutes, 
    my half marathon record is {half_marathon_record} minutes, and my marathon record is {marathon_record} minutes. 
    I would like to {race_training}. The race will be a {race} on {race_date}. 
    I would like to begin my plan at {current_weekly_miles + 5} miles weekly and increase mileage. 
    I would like to run {weekly_sessions} days per week. I would also like to incorporate {weight_training}. 
    Can you create a training plan for me? In this plan, also include a “Notes” section. 
    In the "Notes" section I would like to know more specifics on how to run tempo runs, intervals, 
    long runs, and optimize {weight_training}.
    """

    return prompt

#Function to generate openai training plan 
def get_training_plan(runner):
    prompt = generate_training_plan_prompt(runner)

    response = openai.chat.completions.create(model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a running expert and coach who creates personalized race training plans."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=2050)

    return response.choices[0].message.content.strip()

@app.route('/get-training-plan/<int:runner_id>', methods=['GET'])
def fetch_training_plan(runner_id):
    runner = Runner.query.get(runner_id)
    if not runner:
        return jsonify({"error": "Runner not found"}), 404

    training_plan = get_training_plan(runner)
    return jsonify({"training_plan": training_plan})

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
        existing_record.race=data['race']
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
                               race_date=race_date,
                               race=data['race'], 
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