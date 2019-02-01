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
  }

}

export default ApiService;
