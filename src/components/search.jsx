import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';


class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillMount = () => {
    this.setState({query: ''});
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

      
  render(){
    return (
    <div>
       <input className="input-search" name='query' type="text" onChange={this.onChange} />
       <button className="search-button" onClick={()=>{this.props.searchVideos(this.state.query)}}></button>
    </div>
    )
  }

}

export default Search;