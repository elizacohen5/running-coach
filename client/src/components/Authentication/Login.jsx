import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@mui/material";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@mui/material/Card";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    // backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    margin: theme.spacing(2, 6),
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
    marginTop: theme.spacing(1),
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error signing in");
    }
  };

  const classes = useStyles();

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
              Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleLogin}>
              <TextField
                onChange={(event) => setUsername(event.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                value={username}
                className={classes.textField}
                autoFocus
                InputLabelProps={{
                  style: { backgroundColor: 'white' },
                }}
              />
              <TextField
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className={classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputLabelProps={{
                  style: { backgroundColor: 'white' },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                sx={{
                  margin: (theme) => theme.spacing(3, 0, 2),
                  backgroundColor: "#ff9800",
                  "&:hover": {
                    backgroundColor: "#e68900",
                  },
                }}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item>
                  <NavLink
                    to="/signup"
                    variant="body2"
                    className={classes.whiteText}
                  >
                    {"Don't have an account? Sign Up"}
                  </NavLink>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Typography
                  variant="body2"
                  className={classes.whiteText}
                  align="center"
                >
                  {"Copyright © "}
                  <NavLink color="inherit" to="https://material-ui.com/">
                    OptiRun
                  </NavLink>{" "}
                  {new Date().getFullYear()}
                  {"."}
                </Typography>
              </Box>
            </form>
            <Typography className={classes.whiteText}>{message}</Typography>
          </div>
        </Container>
      </Card>
    </Box>
  );
}
