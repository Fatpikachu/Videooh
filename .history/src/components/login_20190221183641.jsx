import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';
import decode from 'jwt-decode';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleLogin = (e) => {
    e.preventDefault();
    AuthService.login(this.state.email, this.state.password)
      .then((token) => {
        let decoded = decode(token);
        localStorage.setItem('username', decoded.username);
        localStorage.setItem('userID', decoded.id);
        localStorage.setItem('imageurl', decoded.imageurl);
        this.setState({error: false})
        ApiService.myIG()
        .then((res) =>{
          localStorage.setItem('defaultImage', res.data.profile_picture)
        }).catch(err => {
          console.log('error from finding IG image')
        })
        this.props.history.push('/homepage')
        })
      .catch(err => {
        console.log('err in handleLogin', err)
        this.setState({error: true})
      });
  }

  render(){
    return (
    <div>
      <div className='login-box'> Login:  </div>
      <input name='email' type="text" placeholder='email' onChange={this.handleChange} />
      <input name='password' type="text" placeholder='password'onChange={this.handleChange} />
      <button className='login-button' onClick={this.handleLogin}>Login</button>
      {
        this.state.error
        ? <div>Email/password invalid foo</div>
        : <div></div>
      }
    </div>
    )
  }
}

export default Login;