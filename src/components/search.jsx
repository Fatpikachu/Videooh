import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';


class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
    }
  }

  componentWillMount = () => {
    this.setState({query: ''});
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  toggleClass = () => {
    this.setState({open: !this.state.open})
  }
      
  render(){
    var open = this.state.open ? 'open' : null
    return (
      <div className={"search " + open} >
      <form onSubmit={(e)=>{this.props.searchVideos(e, this.state.query)}}>
        <input name='query' type="search" className="search-box" onChange={this.onChange} />
          <span className="search-button" onClick={this.toggleClass}>
          <span className="search-icon"></span>
          </span>
      </form>
    </div>
    )
  }

}

export default Search;