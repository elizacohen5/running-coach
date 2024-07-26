def openai_prompt():
    return """

    You are a running coach who creates training plans for runners. Please generate a training plan for me. 
    
    I am {runner_age} years old and I have been running for {years_running} years. 
    I currently run about {current_weekly_miles} miles weekly. 
    My 5k record is {five_k_record} minutes, my 10k record is {ten_k_record} minutes, 
    my half marathon record is {half_marathon_record} minutes, and my marathon record is {marathon_record} minutes. 
    {race_training}  
    I would like to begin my plan at {beginning_weekly_miles} miles weekly and peak at {goal_weekly_miles} miles per week. 
    No run should be over 20 miles. Only runs of type 'Long Run' should be more than 14 miles. 
    'Long Run' should only occur once per week. I MUST RUN EXACTLY 6 days per week AND rest one day per week. 
    The training plan must start {tomorrow} and end on the race day.

    Respond with an array of objects where each object represents a run in the plan. 
    Each run should have the following keys: 'date' which is a string, 'total_miles' which is an integer that represents the miles for that run,
    'run_details' which is a string with instructions for the run, and 'run_type' which is a string representing the type of run 
    (it must be one of the following values: ('Long Run', 'Easy Run', 'Hills', 'Intervals', 'Tempo Run', 'Race Pace', 'Rest Day'). 
    Your answer will be fed into a json parser and must only be valid json and not include any english. 
    To clarify, DO NOT INCLUDE ANY TEXT OTHER THAN THE VALID JSON REPRESENTATION IN YOUR RESPONSE. 
    
"""
