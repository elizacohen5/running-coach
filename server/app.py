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
# import json
# import ast
from models import db, Runner, CurrentConditioning, PersonalRecords, RunnerGoals, Runs, PlanOverview
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
    race_training = "train for a race" if runner.runner_goals[0].race_training else "increase mileage"
    race = runner.runner_goals[0].race
    race_date = runner.runner_goals[0].race_date
    weekly_sessions = runner.runner_goals[0].weekly_sessions
    weight_training = "weight training" if runner.runner_goals[0].weight_training else "cross training"

    prompt_template = openai_prompt()
    prompt = prompt_template.format(
        runner_age=runner_age,
        years_running=years_running,
        current_weekly_miles=current_weekly_miles,
        five_k_record=five_k_record,
        ten_k_record=ten_k_record,
        half_marathon_record=half_marathon_record,
        marathon_record=marathon_record,
        race_training=race_training,
        race=race,
        race_date=race_date,
        weekly_sessions=weekly_sessions,
        weight_training=weight_training
    )

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

# -------------------------------------------------HELPER FUNCTIONS------------------------------------------------------------------------

def training_plan_to_dict(json_data):
        training_plan_dict = json_data.get("training_plan", "")
        # Remove the leading '```python\n' and trailing '```'
        training_plan_dict = training_plan_dict.lstrip("```pythonn").rstrip("```").strip()
        return training_plan_dict
        
# Example usage:
json_data = {
    "training_plan": "```python\ntraining_plan = {\n    \"Intro\": \"Given your experience and goals, I'll structure a 16-week marathon training plan that culminates in your race on August 31, 2024. Starting mileage is 60 miles weekly, increasing progressively.\",\n    \"Weekly Schedule Overview\": {\n        \"Monday\": \"Easy Run\",\n        \"Tuesday\": \"Interval Training\",\n        \"Wednesday\": \"Easy Run + Weight Training\",\n        \"Thursday\": \"Tempo Run\",\n        \"Friday\": \"Easy Run or Rest\",\n        \"Saturday\": \"Long Run\",\n        \"Sunday\": \"Recovery Run + Weight Training\"\n    },\n    \"Weekly Mileage Breakdown\": {\n        \"Weeks 1-4\": \"Base building (60-65 miles)\",\n        \"Weeks 5-8\": \"Increasing intensity (65-70 miles)\",\n        \"Weeks 9-12\": \"Peak mileage (70-75 miles)\",\n        \"Weeks 13-15\": \"Tapering and recovery (60-50 miles)\",\n        \"Week 16\": \"Race Week\"\n    },\n    \"Detailed Weekly Training Plan\": {\n        \"Weeks 1-4\": [\n            {\"Date\": \"05-27-2024\", \"Type\": \"Easy Run\", \"Details\": \"Easy Run\", \"Miles\": 6},\n            {\"Date\": \"05-28-2024\", \"Type\": \"Intervals\", \"Details\": \"8 miles with 3x800m (w/ 400m jog recovery)\", \"Miles\": 8},\n            {\"Date\": \"05-29-2024\", \"Type\": \"Easy Run\", \"Details\": \"Easy Run - 6 miles + Weight Training\", \"Miles\": 6},\n            {\"Date\": \"05-30-2024\", \"Type\": \"Tempo Run\", \"Details\": \"6 miles (2 miles easy, 2 miles at marathon pace, 2 miles easy)\", \"Miles\": 6},\n            {\"Date\": \"05-31-2024\", \"Type\": \"Easy Run\", \"Details\": \"Easy Run or Rest\", \"Miles\": 4},\n            {\"Date\": \"06-01-2024\", \"Type\": \"Long Run\", \"Details\": \"16 miles at a comfortable pace\", \"Miles\": 16},\n            {\"Date\": \"06-02-2024\", \"Type\": \"Recovery Run\", \"Details\": \"4 miles + Weight Training\", \"Miles\": 4}\n        ],\n        \"Weeks 5-8\": [\n            {\"Date\": \"06-03-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles\", \"Miles\": 6},\n            {\"Date\": \"06-04-2024\", \"Type\": \"Intervals\", \"Details\": \"8 miles with 4x1200m (w/ 400m jog recovery)\", \"Miles\": 8},\n            {\"Date\": \"06-05-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles + Weight Training\", \"Miles\": 6},\n            {\"Date\": \"06-06-2024\", \"Type\": \"Tempo Run\", \"Details\": \"7 miles (2 miles easy, 3 miles at half marathon pace, 2 miles easy)\", \"Miles\": 7},\n            {\"Date\": \"06-07-2024\", \"Type\": \"Easy Run\", \"Details\": \"5 miles\", \"Miles\": 5},\n            {\"Date\": \"06-08-2024\", \"Type\": \"Long Run\", \"Details\": \"18 miles at a comfortable pace\", \"Miles\": 18},\n            {\"Date\": \"06-09-2024\", \"Type\": \"Recovery Run\", \"Details\": \"5 miles + Weight Training\", \"Miles\": 5}\n        ],\n        \"Weeks 9-12\": [\n            {\"Date\": \"06-10-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles\", \"Miles\": 6},\n            {\"Date\": \"06-11-2024\", \"Type\": \"Intervals\", \"Details\": \"9 miles with 5x1000m (w/ 400m jog recovery)\", \"Miles\": 9},\n            {\"Date\": \"06-12-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles + Weight Training\", \"Miles\": 6},\n            {\"Date\": \"06-13-2024\", \"Type\": \"Tempo Run\", \"Details\": \"8 miles (2 miles easy, 4 miles at marathon pace, 2 miles easy)\", \"Miles\": 8},\n            {\"Date\": \"06-14-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles\", \"Miles\": 6},\n            {\"Date\": \"06-15-2024\", \"Type\": \"Long Run\", \"Details\": \"20 miles at a comfortable pace\", \"Miles\": 20},\n            {\"Date\": \"06-16-2024\", \"Type\": \"Recovery Run\", \"Details\": \"6 miles + Weight Training\", \"Miles\": 6}\n        ],\n        \"Weeks 13-15\": [\n            {\"Date\": \"06-17-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles\", \"Miles\": 6},\n            {\"Date\": \"06-18-2024\", \"Type\": \"Intervals\", \"Details\": \"8 miles with 3x1600m (w/ 400m jog recovery)\", \"Miles\": 8},\n            {\"Date\": \"06-19-2024\", \"Type\": \"Easy Run\", \"Details\": \"6 miles + Weight Training\", \"Miles\": 6},\n            {\"Date\": \"06-20-2024\", \"Type\": \"Tempo Run\", \"Details\": \"7 miles (2 miles easy, 3 miles at marathon pace, 2 miles easy)\", \"Miles\": 7},\n            {\"Date\": \"06-21-2024\", \"Type\": \"Easy Run\", \"Details\": \"4 miles\", \"Miles\": 4},\n            {\"Date\": \"06-22-2024\", \"Type\": \"Long Run\", \"Details\": \"22 miles at a comfortable pace\", \"Miles\": 22},\n            {\"Date\": \"06-23-2024\", \"Type\": \"Recovery Run\", \"Details\": \"4 miles + Weight Training\", \"Miles\": 4}\n        ],\n        \"Week 16\": [\n            {\"Date\": \"08-26-2024\", \"Type\": \"Easy Run\", \"Details\": \"4 miles\", \"Miles\": 4},\n            {\"Date\": \"08-27-2024\", \"Type\": \"Intervals\", \"Details\": \"4 miles with 4x200m (w/ 200m jog recovery)\", \"Miles\": 4},\n            {\"Date\": \"08-28-2024\", \"Type\": \"Easy Run\", \"Details\": \"3 miles + Stretching\", \"Miles\": 3},\n            {\"Date\": \"08-29-2024\", \"Type\": \"Rest\", \"Details\": \"Rest and hydration\", \"Miles\": 0},\n            {\"Date\": \"08-30-2024\", \"Type\": \"Rest\", \"Details\": \"Rest and prepare for race day\", \"Miles\": 0},\n            {\"Date\": \"08-31-2024\", \"Type\": \"Race Day\", \"Details\": \"Marathon!\", \"Miles\": 26.2}\n        ]\n    },\n    \"Notes\": {\n        \"Tempo Runs\": \"Run at a pace that is comfortably hard, typically about 20-30 seconds per mile slower than your 5K pace. Warm up with easy running for about 10-15 minutes, run the tempo segment, and then cool down.\",\n        \"Intervals\": \"Short bursts of speed work aimed at increasing your anaerobic threshold. Example: for 800m intervals, aim to run each at 5K pace or slightly faster with equal time for recovery jogging.\",\n        \"Long Runs\": \"These runs build endurance. Aim for a pace that allows you to carry on a conversation. Increase distance gradually, peaking at 20-22 miles.\",\n        \"Weight Training\": \"Incorporate full-body workouts focusing on core strength, legs, and upper body. Aim for 2-3 sessions per week, consisting of compound movements like squats, deadlifts, and presses.\"\n    }\n}\n```"
}
test_ai_response = training_plan_to_dict(json_data)
# print(test_ai_response)

def add_training_plan_to_database(training_plan, runner_id):
    try:
        # Save PlanOverview information
        plan_overview = PlanOverview(
            runner_id=runner_id,
            plan_intro=training_plan.get("Intro"),
            weekly_schedule=str(training_plan.get("Weekly Schedule Overview")),
            weekly_mileage=str(training_plan.get("Weekly Mileage Breakdown")),
            notes=str(training_plan.get("Notes"))
        )
        db.session.add(plan_overview)
        db.session.commit()

        # Save Detailed Weekly Training Plan information
        detailed_plan = training_plan.get("Detailed Weekly Training Plan")
        for week, runs in detailed_plan.items():
            for run in runs:
                new_run = Runs(
                    runner_id=runner_id,
                    run_type=run["Type"],
                    run_details=run["Details"],
                    is_complete=False,  # Assuming initially not complete
                    date=datetime.strptime(run["Date"], "%m-%d-%Y").date(),
                    total_miles=run["Miles"]
                )
                db.session.add(new_run)
        
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"Error adding training plan to database: {str(e)}")
        return False

# add_training_plan_to_database(test_ai_response, 3)



@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5555, debug=True)