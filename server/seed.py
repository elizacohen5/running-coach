# #!/usr/bin/env python3

from datetime import date
from app import app
from models import db, Runner, FutureRuns

def run():
    Runner.query.delete()
    FutureRuns.query.delete()
    db.session.commit()

    runners = [
        Runner(name='Eliza', username='elizacohen5', password='1234'),
        Runner(name='Gabe', username='glk529', password='5678'),
        Runner(name='Pistachio', username='thepman', password='91011')
    ]

    db.session.add_all(runners)
    db.session.commit()

    runs = [
        FutureRuns(runner_id=runners[0].id, distance=3, pace='easy', is_complete=True, run_date=date(2024, 7, 17)),
        FutureRuns(runner_id=runners[0].id, distance=7, pace='race', is_complete=True, run_date=date(2024, 7, 18)),
        FutureRuns(runner_id=runners[0].id, distance=13, pace='long run', is_complete=False, run_date=date(2024, 7, 19)),
        FutureRuns(runner_id=runners[1].id, distance=4, pace='threshold', is_complete=True, run_date=date(2024, 7, 18)),
        FutureRuns(runner_id=runners[1].id, distance=6, pace='tempo', is_complete=False, run_date=date(2024, 7, 19)),
        FutureRuns(runner_id=runners[1].id, distance=8, pace='easy', is_complete=False, run_date=date(2024, 7, 21)),
        FutureRuns(runner_id=runners[2].id, distance=3, pace='threshold', is_complete=True, run_date=date(2024, 7, 22)),
        FutureRuns(runner_id=runners[2].id, distance=1, pace='threshold', is_complete=True, run_date=date(2024, 7, 23)),
        FutureRuns(runner_id=runners[2].id, distance=2, pace='easy', is_complete=True, run_date=date(2024, 7, 24)),
        FutureRuns(runner_id=runners[0].id, distance=1, pace='tempo', is_complete=False, run_date=date(2024, 7, 30))
    ]

    db.session.add_all(runs)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        run()


    