import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';
import Search from './search.jsx';
import VideoList from './videolist.jsx';
import VideoPlayer from './videoplayer.jsx';

class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      profilePic: '',
      dmPage: 1,
    }
  }

  setData = (data) => {
    this.setState({ nextPageToken: data.yt.nextPageToken || '', 
      prevPageToken: data.yt.prevPageToken || '',
      query: data.query,
      yt: data.yt.items,
      dm: data.dm.list,
      vm: data.vmData })
  }

  searchVideos = (query, pageToken, dmPagenate) => {
    let dmPage = this.state.dmPage;
    if(dmPagenate === 'up'){
      dmPage++;
    } else {
      dmPage = dmPage - 1 < 1 ? 1 : dmPage - 1;
    } 
    ApiService.searchVids(query, pageToken, dmPage)
      .then(results => {
        results.query = query;
        this.setData(results);
        console.log('the results from all 3: ', results)
      }).catch(err => console.log('error from searching: ', err))
  }

  handleLogout = () => {
    AuthService.logout();
    this.props.history.replace('/');
  }

  displayVid = (link) => {
    this.setState({ link })
  }
  
  componentWillMount = () => {
    ApiService.myIG()
    .then((res) =>{
      this.setState({profilePic: res.data.profile_picture})
    }).catch(err => {
      console.log('error from finding IG info')
    })
  }

  render(){
    let username = localStorage.getItem('username');
    return (
    <div>
      <h1 className='welcome-box'> Welcome  </h1>
      <div className='username'>
      {
          this.state.profilePic
          ? <img className='profile-pic' src={this.state.profilePic} alt=""/>
          : null
      }
        <h1>  {username}</h1>
      </div>
      <button className='logout-button' onClick={this.handleLogout}>Logout</button>
      <Search searchVideos={this.searchVideos} />
      <VideoList nextPageToken={this.state.nextPageToken}
       prevPageToken={this.state.prevPageToken}
       ytData={this.state.yt}
       dmData={this.state.dm}
       vmData={this.state.vm}
       searchWords={this.state.query}
       searchVideos={this.searchVideos} 
       displayVid={this.displayVid} />
       {
         this.state.link
         ? <VideoPlayer link={this.state.link} />
         : <div className='no-vid'>No video selected</div>
       }
    </div>
    )
  }

}

export default Homepage;