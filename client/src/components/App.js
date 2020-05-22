import React from 'react';

import {  Route, Router, Switch } from 'react-router-dom';

import history from '../utilities/history';
import { UserProvider } from '../contexts/UserContext';
import Signin from './Signin';
import Signup from './SignUp';
import Portfolio from './Portfolio';


function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/signup" component={Signup} />
        <Route path="/" component={Signin} />
      </Switch>
    </Router>
  );
}

export default () => (
  <UserProvider>
    <App/>
  </UserProvider>
);