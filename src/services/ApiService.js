import AuthService from './AuthService.js';

const ApiService = {

  myIG: () => {
    return AuthService.fetch('/myIG', {
      method: 'GET',
    });
  },

  searchVids: (q, pageToken, dmPage) => {
    pageToken = pageToken || '';
    return AuthService.fetch(`/searchVids/?q=${q}&pageToken=${pageToken}&dmPage=${dmPage}`, {
      method: 'GET',
    })
  },

  updateProfile: (pw, email, username, id) => {
    return AuthService.fetch(`/updateprofile/${id}`, {
      method: 'POST',
      body: {
        pw,
        email,
        username
      }
    })
  }


}

export default ApiService;
