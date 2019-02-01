import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect,
} from 'react-router-dom';
import ApiService from './services/ApiService.js';
import AuthService from './services/AuthService.js';
import Mainpage from './components/mainpage.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import Homepage from './components/homepage.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }



  render() {
    const SecretRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        AuthService.loggedIn() === true
          ? <Component {...props} />
          : <Redirect to='/' />
      )} />
    );

    return (
      <HashRouter>
        <div>
          <Route exact path='/' component={Mainpage} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <SecretRoute path='/homepage' component={Homepage} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
