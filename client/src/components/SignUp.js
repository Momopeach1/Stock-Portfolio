import React, { useState } from "react";
import { Link } from 'react-router-dom';
import history from '../utilities/history';
import server from '../apis/server';

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
      <div>
        <div>
          <header>
            <h1>Sign Up</h1>
          </header>
          <div>
            {error !== null && (
              <div>
                {error}
              </div>
            )}
            <form>
              <div  >
                <label htmlFor="displayName">
                  Display Name:
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={displayName}
                  id="displayName"
                  onChange={event => onChangeHandler(event)}
                />
              </div>

                <label htmlFor="userEmail">
                  Email:
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={email}
                  id="userEmail"
                  onChange={event => onChangeHandler(event)}
                />

              <div>
                <label htmlFor="userPassword">
                  Password:
                </label>
                <input
                  type="password"
                  name="userPassword"
                  value={password}
                  placeholder="Your Password"
                  id="userPassword"
                  onChange={event => onChangeHandler(event)}
                />
              </div>
              <button
                onClick={event => {
                  createUserWithEmailAndPasswordHandler(event, email, password);
                }}
              >
                Sign up
              </button>
            </form>

            <p>
              Already have an account?{" "}
              <Link to="/Signin">
                Sign in here
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUp;