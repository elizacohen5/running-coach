from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from sqlalchemy import func

db = SQLAlchemy()

class Runner(db.Model, SerializerMixin):
    __tablename__ = 'runners'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    runs = db.relationship('Runs', back_populates='runner')
    current_conditioning = db.relationship('CurrentConditioning', back_populates='runner')
    personal_records = db.relationship('PersonalRecords', back_populates='runner')
    runner_goals = db.relationship('RunnerGoals', back_populates='runner')

    serialize_rules=['-runs.runner', '-current_conditioning.runner', '-personal_records.runner', 'runner_goals.runner', 'plan_overview.runner']

def __repr__(self):
        return f'<Runner {self.name}>'

class CurrentConditioning(db.Model, SerializerMixin):
       __tablename__ = 'current_conditioning'

       id = db.Column(db.Integer, primary_key=True)
       runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'))
       runner_age = db.Column(db.Integer)
       years_running = db.Column(db.Integer)
       current_weekly_miles = db.Column(db.Integer)

       runner = db.relationship('Runner', back_populates='current_conditioning')
       serialize_rules=['-runner.current_conditioning']

       def __repr__(self):
        return f'<Runner Age: {self.runner_age} Years Running: {self.years_running} Weekly Mileage: {self.current_weekly_miles} >'

class PersonalRecords(db.Model, SerializerMixin):
       __tablename__ = 'personal_records'

       id = db.Column(db.Integer, primary_key=True)
       runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'))
       five_k_record = db.Column(db.Integer)
       ten_k_record = db.Column(db.Integer)
       half_marathon_record = db.Column(db.Integer)
       marathon_record = db.Column(db.Integer)

       runner = db.relationship('Runner', back_populates='personal_records')
       serialize_rules=['-runner.personal_records']

       def __repr__(self):
        return f'<5k: {self.five_k_record} 10k: {self.ten_k_record} 1/2 marathon: {self.half_marathon_record} marathon: {self.marathon_record}>'

class RunnerGoals(db.Model, SerializerMixin):
     __tablename__ = 'runner_goals'

     id = db.Column(db.Integer, primary_key=True)
     runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'))
     race_training = db.Column(db.Boolean)
     base_building = db.Column(db.Boolean)
     weekly_mileage = db.Column(db.Integer)
     weekly_sessions = db.Column(db.Integer)
     weight_training = db.Column(db.Boolean)
     cross_training = db.Column(db.Boolean)
     race_date = db.Column(db.Date)
     race = db.Column(db.String)

     runner = db.relationship('Runner', back_populates='runner_goals')
     serialize_rules=['-runner.runner_goals']

     def __repr__(self):
        return f'<Goals are Mileage: {self.weekly_mileage} Sessions: {self.weekly_sessions} Race Date: {self.race_date} >'


class Runs(db.Model, SerializerMixin):
      __tablename__ = 'runs'

      id = db.Column(db.Integer, primary_key=True)
      runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'))
      run_type = db.Column(db.String)
      run_details = db.Column(db.String)
      is_complete = db.Column(db.Boolean)
      created_at = db.Column(db.DateTime, default=datetime.now())
      date = db.Column(db.Date)
      total_miles = db.Column(db.Integer)

      runner = db.relationship('Runner', back_populates='runs')
      serialize_rules=['-runner.runs']

      def __repr__(self):
        return f'<Runner: {self.runner_id} Type: {self.run_type} Details: {self.run_details} Total Miles: {self.total_miles} Date: {self.date}>'
      


# class PlanOverview(db.Model, SerializerMixin):
#      __tablename__ = 'plan_overview'

#      id = db.Column(db.Integer, primary_key=True)
#      runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'))
#      plan_intro = db.Column(db.String)
#      weekly_schedule = db.Column(db.String)
#      weekly_mileage = db.Column(db.String)
#      notes = db.Column(db.String)

#      runner = db.relationship('Runner', back_populates='plan_overview')
#      serialize_rules=['-runner.plan_overview']

# def __repr__(self):
#         return f'<Runner: {self.runner_id} >'
