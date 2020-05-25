import React, { useState } from "react";
import { Link } from 'react-router-dom';
import history from '../utilities/history';
import server from '../apis/server';

//material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import '../styles/Signup.css';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState(null);
  
    const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
      event.preventDefault();
      try{
        await server.post('/user/signup', { displayName, email, password });
        history.push('/signin');
      }
      catch(error){
        setError('Error Signing up with email and password');
      }
      setEmail("");
      setPassword("");
      setDisplayName("");
    };
  
    const onChangeHandler = event => {
      const { name, value } = event.currentTarget;
  
      if (name === "userEmail") {
        setEmail(value);
      } else if (name === "userPassword") {
        setPassword(value);
      } else if (name === "displayName") {
        setDisplayName(value);
      }
    };
    
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="paper">
        <Avatar className={"avatar"}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className="form" noValidate>
          <TextField
            autoComplete="displayName"
            name="displayName"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="displayName"
            label="Name"
            autoFocus
            onChange={event => onChangeHandler(event)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userEmail"
            label="Email Address"
            name="userEmail"
            autoComplete="email"
            onChange={event => onChangeHandler(event)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="userPassword"
            label="Password"
            type="password"
            id="userPassword"
            autoComplete="current-password"
            onChange={event => onChangeHandler(event)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit"
            onClick={event => {
             createUserWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item xs>
                <p>
                Already have an account?{" "}
                <Link to="signin" >
                  Sign in here
                </Link>{" "}
                </p>
              </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    );
  };
  
  export default SignUp;