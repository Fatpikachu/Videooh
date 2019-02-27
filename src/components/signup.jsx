import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';


class Signup extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: false,
      signup: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  handleSignUp = (e) => {
    e.preventDefault();

    const { username, password, email } = this.state;

    AuthService.signup(username, password, email)
      .then(res => {
        this.setState({error: false, signup: true})
      })
      .catch(err => {
        this.setState({error: true})
        console.error(err)
      });
  }

  handleLogin = () => {
    this.props.history.replace('/login');
  }

  render(){

    return (
      <div>
      {
        !this.state.error && this.state.signup
        ?
        <div>
        <div>Thxs for signing up, please login</div>
        <button onClick={this.handleLogin}>Login</button>
        </div>
        :
      <div>
      <div className='signup-box'> Signup:  </div>
      <input name='username' placeholder='Username' type='text' onChange={this.handleChange} />
      <input name='email' placeholder='Email' type="password" onChange={this.handleChange} />
      <input name='password' placeholder='Password' type="password" onChange={this.handleChange} />
      <button onClick={this.handleSignUp}>submit</button>
      {
        this.state.error
        ? <div>Email already exists</div>
        : <div></div>
      }
      </div>
    }
    </div>
    )
  }


}

export default Signup;