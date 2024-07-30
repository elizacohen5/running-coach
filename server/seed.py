# #!/usr/bin/env python3

from datetime import date
from app import app
from models import db, Runner, Runs, CurrentConditioning, PersonalRecords, RunnerGoals

def run():
    # Runner.query.delete()
    Runs.query.delete()
    CurrentConditioning.query.delete()
    PersonalRecords.query.delete()
    RunnerGoals.query.delete()
    Runner.query.delete()
    db.session.commit()

    # runners = [
    #     Runner(name='Eliza', username='elizacohen5', password='1234'),
    #     Runner(name='Gabe', username='glk529', password='5678'),
    #     Runner(name='Pistachio', username='thepman', password='91011')
    # ]

    # db.session.add_all(runners)
    # db.session.commit()

    # current_conditioning = [
    #     CurrentConditioning(runner_id=1, runner_age=32, years_running=20, current_weekly_miles=25),
    #     CurrentConditioning(runner_id=2, runner_age=12, years_running=6, current_weekly_miles=15),
    #     CurrentConditioning(runner_id=3, runner_age=25, years_running=15, current_weekly_miles=55)
    # ]

    # db.session.add_all(current_conditioning)
    # db.session.commit()

    # personal_records = [
    #     PersonalRecords(runner_id=1, five_k_record=26, ten_k_record=52, half_marathon_record=110, marathon_record=260),
    #     PersonalRecords(runner_id=2, five_k_record=25, ten_k_record=50, half_marathon_record=100, marathon_record=240),
    #     PersonalRecords(runner_id=3, five_k_record=19, ten_k_record=38, half_marathon_record=80, marathon_record=180)
    # ]

    # db.session.add_all(personal_records)
    # db.session.commit()

    # runner_goals = [
    #     RunnerGoals(runner_id=1, race_training=False, base_building=True, weekly_mileage=25, weekly_sessions=4, weight_training=True, cross_training=False, race_date=date(2025, 1, 1), race='5k'),
    #     RunnerGoals(runner_id=2, race_training=True, base_building=True, weekly_mileage=30, weekly_sessions=5, weight_training=False, cross_training=True, race_date=date(2024, 10, 10), race='10k'),
    #     RunnerGoals(runner_id=3, race_training=True, base_building=False, weekly_mileage=60, weekly_sessions=6, weight_training=True, cross_training=False, race_date=date(2024, 8, 31), race='Marathon')
    # ]

    # db.session.add_all(runner_goals)
    # db.session.commit()

    # runs = [
    #     FutureRuns(runner_id=3, distance=3, pace='easy', is_complete=True, run_date=date(2024, 7, 28)),
    #     FutureRuns(runner_id=2, distance=7, pace='race', is_complete=True, run_date=date(2024, 7, 27)),
    #     FutureRuns(runner_id=1, distance=13, pace='long run', is_complete=False, run_date=date(2024, 7, 30)),
    #     FutureRuns(runner_id=3, distance=4, pace='threshold', is_complete=True, run_date=date(2024, 7, 31)),
    #     FutureRuns(runner_id=2, distance=6, pace='tempo', is_complete=False, run_date=date(2024, 7, 25)),
    #     FutureRuns(runner_id=1, distance=8, pace='easy', is_complete=False, run_date=date(2024, 7, 21)),
    #     FutureRuns(runner_id=3, distance=3, pace='threshold', is_complete=True, run_date=date(2024, 7, 22)),
    #     FutureRuns(runner_id=2, distance=1, pace='threshold', is_complete=True, run_date=date(2024, 7, 23)),
    #     FutureRuns(runner_id=1, distance=2, pace='easy', is_complete=True, run_date=date(2024, 7, 24)),
    #     FutureRuns(runner_id=3, distance=1, pace='tempo', is_complete=False, run_date=date(2024, 7, 30)),
    #     FutureRuns(runner_id=2, distance=1, pace='tempo', is_complete=False, run_date=date(2024, 7, 30))
    # ]

    # db.session.add_all(runs)
    # db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        run()


    