import React, {Component} from 'react';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';
import Homepage from './homepage.jsx';

class Mainpage extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){

    return (
    <div>
      {
      AuthService.loggedIn() ?
      <Homepage />
      :
      (<div>
      <h1 className='welcome-box'> 看看看~! </h1>
        <p>watch anime and dramas sign in to watch!</p>
        <NavLink to='/login'> login </NavLink>
        <NavLink to='/signup'> signup </NavLink>
        </div>
      )
      }
    </div>
    )
  }

}

export default Mainpage;