from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS


from models import db, Runner, FutureRuns

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

CORS(app, supports_credentials=True)  # set up cors

@app.route('/', methods=['GET'])
def get_all_runs():
    pass

@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5555, debug=True)