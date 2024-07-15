from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class Runner(db.Model, SerializerMixin):
    __tablename__ = 'runners'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    password = db.Column(db.String)

    runs = db.relationship('FutureRuns', back_populates='runner')

    serialize_rules=['-runs.runner']

def __repr__(self):
        return f'<Runner {self.name}>'

class FutureRuns(db.Model, SerializerMixin):
      __tablename__ = 'future_runs'

      id = db.Column(db.Integer, primary_key=True)
      runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'))
      distance = db.Column(db.Integer)
      pace = db.Column(db.String)
      is_complete = db.Column(db.Boolean)

      runner = db.relationship('Runner', back_populates='runs')

      serialize_rules=['-runner.runs']

def __repr__(self):
        return f'<Runner {self.runner_id} {self.distance} {self.pace}>'
