import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CurrentConditioningForm from "./CurrentConditioningForm";
import PersonalRecordsForm from "./PersonalRecordsForm";
import GoalsForm from "./GoalsForm";
import { UserProvider } from "../UserContext";

const steps = ["Current Conditioning", "Personal Records", "Goals"];

export default function NewPlan() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [formData, setFormData] = React.useState({});

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (formData[steps[activeStep]]) {
      submitFormData(formData[steps[activeStep]], getUrlForStep(activeStep))
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
