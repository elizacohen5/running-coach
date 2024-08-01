import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@mui/material";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Card from "@mui/material/Card";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    "& .MuiInputBase-root": {
      backgroundColor: "white",
    },
  },
  whiteText: {
    color: "white",
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const goToLogIn = () => {
    navigate("/login");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5555/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      goToLogIn();
    } catch (error) {
      setMessage("Error registering user");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#5b5b5b",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          mx: 2,
          paddingX: "100px",
          paddingY: "35px",
          backgroundColor: "#1c1c1c",
          border: "2px solid #ff6f61",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              className={classes.whiteText}
            >
              Sign up
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSignup}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    className={classes.textField}
                    onChange={(e) => setName(e.target.value)}
                    InputLabelProps={{
                      style: { backgroundColor: 'white' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    className={classes.textField}
                    onChange={(e) => setUsername(e.target.value)}
                    InputLabelProps={{
                      style: { backgroundColor: 'white' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    className={classes.textField}
                    onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{
                      style: { backgroundColor: 'white' },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                sx={{
                  margin: theme => theme.spacing(3, 0, 2),
                  backgroundColor: '#ff9800',
                  '&:hover': {
                    backgroundColor: '#e68900',
                  },
                }}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" className={classes.whiteText}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
            {message && (
              <Typography className={classes.whiteText}>{message}</Typography>
            )}
          </div>
          <Box mt={5}>
            <Typography
              variant="body2"
              align="center"
              className={classes.whiteText}
            >
              {"Copyright © "}
              <Link color="inherit" href="https://material-ui.com/">
                Optirun
              </Link>{" "}
              {new Date().getFullYear()}
              {"."}
            </Typography>
          </Box>
        </Container>
      </Card>
    </Box>
  );
}
