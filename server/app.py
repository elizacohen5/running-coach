from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import openai
import json
from models import db, Runner, CurrentConditioning, PersonalRecords, RunnerGoals, Runs
from prompt_template import openai_prompt

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
    # print(runner)
    runner_age = runner.current_conditioning[0].runner_age
    years_running = runner.current_conditioning[0].years_running
    current_weekly_miles = runner.current_conditioning[0].current_weekly_miles
    five_k_record = runner.personal_records[0].five_k_record
    ten_k_record = runner.personal_records[0].ten_k_record
    half_marathon_record = runner.personal_records[0].half_marathon_record
    marathon_record = runner.personal_records[0].marathon_record
    race = runner.runner_goals[0].race
    race_date = runner.runner_goals[0].race_date
    race_training = f"I am training for a race. The race will be a {race} on {race_date}." if runner.runner_goals[0].race_training else ""
    weekly_sessions = runner.runner_goals[0].weekly_sessions
    # weight_training = "weight training" if runner.runner_goals[0].weight_training else "cross training"

    prompt_template = openai_prompt()
    prompt = prompt_template.format(
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        runner_age=runner_age,
        years_running=years_running,
        current_weekly_miles=current_weekly_miles,
        beginning_weekly_miles = current_weekly_miles + 5,
        goal_weekly_miles = current_weekly_miles + 20,
        five_k_record=five_k_record,
        ten_k_record=ten_k_record,
        half_marathon_record=half_marathon_record,
        marathon_record=marathon_record,
        race_training=race_training,
        race=race,
        race_date=race_date,
        weekly_sessions=weekly_sessions,
        # weight_training=weight_training
    )

    return prompt

#Function to generate openai training plan 
def get_training_plan(runner):
    prompt = generate_training_plan_prompt(runner)
    print(prompt)

    # response = openai.chat.completions.create(model="gpt-4o-mini",
    # messages=[
    #     {"role": "system", "content": "You are a running expert and coach who creates personalized race training plans."},
    #     {"role": "user", "content": prompt}
    # ],
    # max_tokens=2050)

    # formatted_response = response.choices[0].message.content.strip()

    # prefix = "```json"
    # if formatted_response.startswith(prefix):
    #     # Remove the prefix and any leading or trailing whitespace
    #     formatted_response = formatted_response[len(prefix):].strip()
    
    # suffix = "```"
    # if formatted_response.endswith(suffix):
    #     # Remove the prefix and any leading or trailing whitespace
    #     formatted_response = formatted_response[:(-1 * len(suffix))].strip()
    

    # return formatted_response
    return """[
    {"date": "2024-07-26", "total_miles": 6, "run_details": "Easy run to build base", "run_type": "Easy Run"},
    {"date": "2024-07-27", "total_miles": 8, "run_details": "Tempo run at a sustained pace", "run_type": "Tempo Run"},
    {"date": "2024-07-28", "total_miles": 10, "run_details": "Easy run with strides", "run_type": "Easy Run"},
    {"date": "2024-07-29", "total_miles": 12, "run_details": "Hills training, repeat hill 4 times", "run_type": "Hills"},
    {"date": "2024-07-30", "total_miles": 4, "run_details": "Recovery run", "run_type": "Easy Run"},
    {"date": "2024-07-31", "total_miles": 14, "run_details": "Long run with a steady pace", "run_type": "Long Run"},
    {"date": "2024-08-01", "total_miles": 0, "run_details": "Rest day", "run_type": "Rest Day"},
    {"date": "2024-08-02", "total_miles": 7, "run_details": "Easy run to recover", "run_type": "Easy Run"},
    {"date": "2024-08-03", "total_miles": 8, "run_details": "Intervals: 5x1000m with rest", "run_type": "Intervals"},
    {"date": "2024-08-04", "total_miles": 10, "run_details": "Easy run with a few pickups", "run_type": "Easy Run"},
    {"date": "2024-08-05", "total_miles": 12, "run_details": "Race pace running for 4 miles", "run_type": "Race Pace"},
    {"date": "2024-08-06", "total_miles": 4, "run_details": "Recovery run", "run_type": "Easy Run"},
    {"date": "2024-08-07", "total_miles": 16, "run_details": "Long run with some faster sections", "run_type": "Long Run"},
    {"date": "2024-08-08", "total_miles": 0, "run_details": "Rest day", "run_type": "Rest Day"},
    {"date": "2024-08-09", "total_miles": 7, "run_details": "Easy run with stretches", "run_type": "Easy Run"},
    {"date": "2024-08-10", "total_miles": 8, "run_details": "Tempo run at a faster clip", "run_type": "Tempo Run"},
    {"date": "2024-08-11", "total_miles": 10, "run_details": "Easy run, focus on form", "run_type": "Easy Run"},
    {"date": "2024-08-12", "total_miles": 12, "run_details": "Hills with 5 repeats", "run_type": "Hills"},
    {"date": "2024-08-13", "total_miles": 4, "run_details": "Recovery run", "run_type": "Easy Run"},
    {"date": "2024-08-14", "total_miles": 18, "run_details": "Long run at a consistent pace", "run_type": "Long Run"},
    {"date": "2024-08-15", "total_miles": 0, "run_details": "Rest day", "run_type": "Rest Day"},
    {"date": "2024-08-16", "total_miles": 8, "run_details": "Easy run to keep legs fresh", "run_type": "Easy Run"},
    {"date": "2024-08-17", "total_miles": 9, "run_details": "Intervals: 6x800m with rest", "run_type": "Intervals"},
    {"date": "2024-08-18", "total_miles": 10, "run_details": "Easy run with short strides", "run_type": "Easy Run"},
    {"date": "2024-08-19", "total_miles": 12, "run_details": "Race pace segments during the run", "run_type": "Race Pace"},
    {"date": "2024-08-20", "total_miles": 4, "run_details": "Short, easy recovery run", "run_type": "Easy Run"},
    {"date": "2024-08-21", "total_miles": 20, "run_details": "Long run at marathon effort", "run_type": "Long Run"},
    {"date": "2024-08-22", "total_miles": 0, "run_details": "Rest day", "run_type": "Rest Day"},
    {"date": "2024-08-23", "total_miles": 6, "run_details": "Easy run", "run_type": "Easy Run"},
    {"date": "2024-08-24", "total_miles": 8, "run_details": "Tempo run, strong effort", "run_type": "Tempo Run"},
    {"date": "2024-08-25", "total_miles": 10, "run_details": "Easy run with gentle hills", "run_type": "Easy Run"},
    {"date": "2024-08-26", "total_miles": 12, "run_details": "Last intervals: 4x400m", "run_type": "Intervals"},
    {"date": "2024-08-27", "total_miles": 4, "run_details": "Recovery run to stay loose", "run_type": "Easy Run"},
    {"date": "2024-08-28", "total_miles": 18, "run_details": "Long run, easy pace", "run_type": "Long Run"},
    {"date": "2024-08-29", "total_miles": 0, "run_details": "Rest day", "run_type": "Rest Day"},
    {"date": "2024-08-30", "total_miles": 4, "run_details": "Shakeout run before the race", "run_type": "Easy Run"},
    {"date": "2024-08-31", "total_miles": 26, "run_details": "Marathon race day", "run_type": "Long Run"}
]"""

@app.route('/get-training-plan/<int:id>', methods=['GET'])
def fetch_training_plan(id):
    runner = Runner.query.filter(Runner.id == id).first()
    if not runner:
        return jsonify({"error": "Runner not found"}), 404

    training_plan = get_training_plan(runner)
    print(training_plan)

    if add_runs_to_db(training_plan, id): 
        return jsonify({"message": "Training plan added to database successfully."})
    else:
        return jsonify({"error": "Failed to add training plan to database."}), 500


@app.route('/goals/<int:id>', methods=['GET'])
def get_goals(id):
    try:
        runner = Runner.query.filter(Runner.id == id).first()
        print(runner)
        goals = []
        for goal in runner.runner_goals:
            goal_dict = goal.to_dict()
            goals.append(goal_dict)
        return make_response(jsonify(goals), 200)
    except Exception as e:
        print(f"Error fetching goals: {str(e)}")
        return make_response(jsonify({'error': 'Failed to fetch goals'}), 500)
    

    
@app.route('/records/<int:id>', methods=['GET'])
def get_records(id):
    try:
        runner = Runner.query.filter(Runner.id == id).first()
        print(runner)
        records = []
        for record in runner.personal_records:
            record_dict = record.to_dict()
            records.append(record_dict)
        return make_response(jsonify(records), 200)
    except Exception as e:
        print({"message": f"Error fetching personal records: {str(e)}"})
        return make_response(jsonify({'error': 'Failed to fetch personal records'}), 500)


@app.route('/runs/<int:id>', methods=['GET'])
def get_all_runs(id):
    try:
        runner = Runner.query.filter(Runner.id == id).first()
        print(runner)
        runs = []
        for run in runner.runs:
            run_dict = run.to_dict()
            runs.append(run_dict)
        return make_response(jsonify(runs), 200)
    except Exception as e:
        print(f"Error fetching runs: {str(e)}")
        return make_response(jsonify({'error': 'Failed to fetch runs'}), 500)

@app.route('/runs/<int:id>', methods=['PATCH'])
def update_run(id):
    try:
        run = Runs.query.filter(Runs.id == id).first()
        if not run:
            return make_response(jsonify({'error': 'Run not found'}), 404)
        
        data = request.get_json()
        if 'is_complete' in data:
            run.is_complete = data['is_complete']
        
        db.session.commit()
        return make_response(jsonify(run.to_dict()), 200)
    except Exception as e:
        print(f"Error updating run: {str(e)}")
        return make_response(jsonify({'error': 'Failed to update run'}), 500)


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

# -------------------------------------------------HELPER FUNCTIONS------------------------------------------------------------------------

def add_runs_to_db(json_response, runner_id):
    try: 
        runs_data = json.loads(json_response)
        for run in runs_data:
            # Convert 'date' to a datetime.date object
            run_date = datetime.strptime(run['date'], '%Y-%m-%d').date()
            # Create a new Runs object
            new_run = Runs(
                runner_id=runner_id,  # Set this according to your application logic
                run_type=run['run_type'],
                run_details=run['run_details'],
                is_complete=False,
                date=run_date,
                total_miles=run['total_miles']
            )
        # Add the new run to the session
            db.session.add(new_run)
        # Commit the transaction
        db.session.commit()
        print("Runs successfully added to database")
        return True

    except Exception as e:
        db.session.rollback()
        print("Error adding runs to database:", e)

# Example 
json_response = '''
[
    {
        "date": "2024-07-29",
        "run_type": "Easy Run",
        "run_details": "Run at a slow, conversational pace",
        "total_miles": 6
    },
    {
        "date": "2024-07-30",
        "run_type": "Tempo Run",
        "run_details": "6 miles (2 miles easy, 2 miles at marathon pace, 2 miles easy)",
        "total_miles": 6
    },
    {
        "date": "2024-07-31",
        "run_type": "Intervals",
        "run_details": "8 miles with 3x800m (w/ 400m jog recovery)",
        "total_miles": 8
    },
    {
        "date": "2024-08-01",
        "run_type": "Intervals",
        "run_details": "8 miles with 3x800m (w/ 400m jog recovery)",
        "total_miles": 8
    },
    {
        "date": "2024-08-02",
        "run_type": "Easy Run",
        "run_details": "Easy Run - 6 miles + Weight Training",
        "total_miles": 6
    }
]
'''


# @app.route('/add-runs-test/<int:id>', methods=['GET'])
# def add_runs_test(id):
#     try:
#         add_runs_to_db(json_response, id)
#     except Exception as e:
#         print(e)
#         return jsonify({"message": "Did not work!"}), 401
#     return jsonify({"complete": {"response": json_response}})



@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5555, debug=True)