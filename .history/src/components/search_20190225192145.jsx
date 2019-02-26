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
    this.setState({'open': !this.state.open})
  }


      
  render(){
    return (
    // <div className='search-bar'>
    //   <form onSubmit={(e)=>{this.props.searchVideos(e, this.state.query)}}>
    //    <input className="input-search" name='query' type="text" onChange={this.onChange} />
    //    <button className="search-button" type="submit" >search</button>
    //   </form>
    // </div>
    <div class={"search " + this.state.open ? 'open' : null} >
      <form onSubmit={(e)=>{this.props.searchVideos(e, this.state.query)}}>
        <input name='query' type="search" className="search-box" onChange={this.onChange} />
        <span className="search-button">
          <span className="search-icon"></span>
        </span>
        </form>
    </div>
    )
  }

}

export default Search;