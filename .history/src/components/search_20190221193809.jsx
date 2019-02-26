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
    <div className='search-bar'>
      <form onSubmit={(e)=>{this.props.searchVideos(e, this.state.query)}}>
       <input className="input-search" name='query' type="text" onChange={this.onChange} />
       <button className="search-button" type="submit" >search</button>
      </form>
    </div>
    )
  }

}

export default Search;