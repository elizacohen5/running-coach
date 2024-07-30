import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CurrentConditioningForm from "./CurrentConditioningForm";
import PersonalRecordsForm from "./PersonalRecordsForm";
import GoalsForm from "./GoalsForm";
import { UserProvider, useUser } from "../UserContext"; // Ensure to import useUser
import { useNavigate } from "react-router-dom";

const steps = ["Current Conditioning", "Personal Records", "Goals"];

export default function NewPlan() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const { user } = useUser(); // Get the user data from the context
  const navigate = useNavigate(); // Use for navigation

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    if (formData[steps[activeStep]]) {
      await submitFormData(formData[steps[activeStep]], getUrlForStep(activeStep));
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      // This is the last step, make the API call to get the training plan
      setLoading(true);
      fetchTrainingPlan();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setSkipped(newSkipped);
  };

  const fetchTrainingPlan = async () => {
    console.log(user)
    try {
      const response = await fetch(`http://127.0.0.1:5555/get-training-plan/${user.id}`);
      const result = await response.json();
      console.log('Training plan fetched successfully:', result);
      // Simulate a delay for the loading spinner
      setTimeout(() => {
        setLoading(false);
        setCompleted(true);
      }, 2000);
    } catch (error) {
      console.error('Error fetching training plan:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(false);
  };

  const getUrlForStep = (step) => {
    switch(step) {
      case 0:
        return 'http://127.0.0.1:5555/current_conditioning';
      case 1: 
        return 'http://127.0.0.1:5555/personal_records';
      case 2: 
        return 'http://127.0.0.1:5555/runner_goals';
      default:
        return '';
    }
  }

  const submitFormData = async (data, url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Form submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFormDataChange = (step, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [steps[step]]: data,
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
            <CurrentConditioningForm onFormDataChange={(data) => handleFormDataChange(step, data)} />
        );
      case 1:
        return (
            <PersonalRecordsForm onFormDataChange={(data) => handleFormDataChange(step, data)} />
        );
      case 2:
        return (
            <GoalsForm onFormDataChange={(data) => handleFormDataChange(step, data)} />
        );
      default:
        return "Unknown step";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (completed) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h4" component="div" color="white" textAlign="center" sx={{ fontWeight: "bold", mb: 3 }}>
          Training Plan Complete!
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/training-plan")}>
          Go to Training Plan
        </Button>
      </Box>
    );
  }

  return (
    <UserProvider>
      <Box sx={{ width: "90%", mt: 3, ml: 10 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} sx={{ color: "white" }}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, color: "white" }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 2, mb: 1 }}>{getStepContent(activeStep)}</Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, color: "white" }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </UserProvider>
  );
}
