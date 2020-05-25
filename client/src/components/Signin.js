import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';

//material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'; 

//file imports
import server from '../apis/server';
import UserContext from '../contexts/UserContext';
import history from '../utilities/history';
import '../styles/Signin.css';

const SignIn = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { setUser, setIsAuth } = useContext(UserContext);

  const signInWithEmailAndPasswordHandler = (event,email, password) => {
      event.preventDefault();
      server.post('/user/signin', { email, password })
        .then(response => {
          setUser(response.data);
          setIsAuth(true);
          history.push('/portfolio'); 
        })
        .catch(error => console.log(error));
    };
    
    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;
      
        if(name === 'userEmail') {
          setEmail(value);
        }
        else if(name === 'userPassword'){
          setPassword(value);
        }
    };


return (
  <Container component="main" maxWidth="xs">
    <CssBaseline />
    <div className ="paper">
      <Avatar className="avatar">
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <form className="form" noValidate>
        <TextField 
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="userEmail"
          label="Email Address"
          name="userEmail"
          autoComplete="email"
          autoFocus
          type="email"
          onChange={(event) => onChangeHandler(event)}
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
          onChange={(event) => onChangeHandler(event)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="submit"
          onClick={(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <p>
              Don't have an account?{" "}
              <Link to="signup" >
                Sign up here
              </Link>{" "}
              </p>
            </Grid>
          </Grid>
      </form>
    </div>
  </Container>
);
};

export default SignIn;