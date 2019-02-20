import decode from 'jwt-decode';

const AuthService = {
  domain: 'http://localhost:3000',
  login: (email, password) => {
    // Get a token from api server using the fetch api
    return AuthService.fetch('/login', {
      method: 'POST',
      body: { email, password }
    }).then(token => {
      AuthService.setToken(token)
      return token;
    })
  },
  signup: (username, password, email) => {
    // Get a token from api server using the fetch api
    return AuthService.fetch('/users', {
      method: 'POST',
      body: { username, password, email }
    })
  },
  loggedIn: () => {
    // Checks if there is a saved token and it's still valid
    const token = AuthService.getToken() // Getting token from localstorage
    return !!token && !AuthService.isTokenExpired(token) 
  },
  isTokenExpired: (token) => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
        return true;
      } else {
        return false
      }
    }
    catch (err) {
      return false;
    }
  },
  setToken: (idToken) => {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  },
  getToken: () => {
    // Retrieves the user token from localStorage
    const token = localStorage.getItem('id_token');
    return token;
  },
  logout: () => {
    // Clear user token and profile data from localStorage
    localStorage.clear();
  },
  getProfile: () => {
    // Using jwt-decode npm package to decode the token
    return decode(AuthService.getToken());
  },
  fetch: (url, options) => {
    options.body = JSON.stringify(options.body);

    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (AuthService.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + AuthService.getToken()
    }
    return fetch(AuthService.domain + url, { headers, ...options })
      .then(AuthService._checkStatus)
      .then(response => response.json())
  },
  _checkStatus: (response) => {
    // raises an error in case response status is not a success

    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error;
    }
  }
}

export default AuthService;
