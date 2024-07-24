
def openai_prompt():
    return """
    I am {runner_age} years old and I have been running for {years_running} years. 
    I currently run about {current_weekly_miles} miles weekly. 
    My 5k record is {five_k_record} minutes, my 10k record is {ten_k_record} minutes, 
    my half marathon record is {half_marathon_record} minutes, and my marathon record is {marathon_record} minutes. 
    I would like to {race_training}. The race will be a {race} on {race_date}. 
    I would like to begin my plan at {current_weekly_miles} + 5 miles weekly and increase mileage. 
    I would like to run {weekly_sessions} days per week. I would also like to incorporate {weight_training}. 
    Can you create a training plan for me? In this plan, also include a “Notes” section. 
    In the "Notes" section I would like to know more specifics on how to run tempo runs, intervals, 
    long runs, and optimize {weight_training}.

    Include a date for each run based on the date of submission and the inputted race date. 
    Structure the plan as a python object.
    Use the following sample as a template: 

    Training Plan:
    - Intro: "Given your experience and goals, I'll structure a 16-week marathon training plan that culminates in your race on August 31, 2024. Starting mileage is 60 miles weekly, increasing progressively."
    - Weekly Schedule Overview:
        - Monday: Easy Run
        - Tuesday: Interval Training
        - Wednesday: Easy Run + Weight Training
        - Thursday: Tempo Run
        - Friday: Easy Run or Rest
        - Saturday: Long Run
        - Sunday: Recovery Run + Weight Training
    - Weekly Mileage Breakdown:
        - Weeks 1-4: Base building (60-65 miles)
        - Weeks 5-8: Increasing intensity (65-70 miles)
        - Weeks 9-12: Peak mileage (70-75 miles)
        - Weeks 13-15: Tapering and recovery (60-50 miles)
        - Week 16: Race Week
    - Detailed Weekly Training Plan:
        - Weeks 1-4:
            - Monday: Date: 05-27-2024, Type: Easy Run, Details: Easy Run, Miles: 6
            - Tuesday: Date: 05-28-2024, Type: Intervals, Details: 8 miles with 3x800m (w/ 400m jog recovery), Miles: 8
            - Wednesday: Date: 05-29-2024, Type: Easy Run, Details: Easy Run - 6 miles + Weight Training, Miles: 6
            - Thursday: Date: 05-30-2024, Type: Tempo Run, Details: 6 miles (2 miles easy, 2 miles at marathon pace, 2 miles easy), Miles: 6
            - Friday: Date: 05-31-2024, Type: Easy Run, Details: Easy Run or Rest, Miles: 4
            - Saturday: Date: 06-01-2024, Type: Long Run, Details: 16 miles at a comfortable pace, Miles: 16
            - Sunday: Date: 06-02-2024, Type: Recovery Run, Details: 4 miles + Weight Training, Miles: 4
        - Week 16:
            - Monday: Date: 08-26-2024, Type: Easy Run, Details: 4 miles, Miles: 4
            - Tuesday: Date: 08-27-2024, Type: Intervals, Details: 4 miles with 4x200m (w/ 200m jog recovery), Miles: 4
            - Wednesday: Date: 08-28-2024, Type: Easy Run, Details: 3 miles + Stretching, Miles: 3
            - Thursday: Date: 08-29-2024, Type: Rest, Details: Rest and hydration, Miles: 0
            - Friday: Date: 08-30-2024, Type: Rest, Details: Rest and prepare for race day, Miles: 0
            - Saturday: Date: 08-31-2024, Type: Race Day, Details: Marathon!, Miles: 26.2
"""
