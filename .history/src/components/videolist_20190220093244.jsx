import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';
import VideoSnippet from './videosnippet.jsx';

class VideoList extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }

  nextPage = (e) => {
    this.props.searchVideos(e, this.props.searchWords, this.props.nextPageToken, 'up')
  }

  prevPage = (e) => {
    this.props.searchVideos(e, this.props.searchWords, this.props.prevPageToken, 'down')
  }
   
  componentWillMount(){

  }

  render(){
    let ytData = []
    let dmData = this.props.dmData || [];
    let vmData = this.props.vmData || [];
    let loading = this.props.loading;
    dmData.forEach((item)=>{item.source = 'dm'});
    if(this.props.ytData){
      for(let item of this.props.ytData){
        ytData.push({ description: item.snippet.description,
                          id: item.id.videoId,
                          title: item.snippet.title,
                          thumbnail_120_url: item.snippet.thumbnails.high.url, 
                          source: 'yt' })
      }
    }
    let allData = ytData.concat(dmData, vmData)
    console.log('the allData: ', allData)
    return (
      <div className='wide-wrapper'>
        <div className='paginate'>
        <button onClick={this.prevPage}> &lt; </button>
        <button onClick={this.nextPage}> &gt; </button>
        </div>
        <div className='video-list'>
          {
          loading
          ? <div className="loader"></div>
          : allData.length > 0
          ? allData.map((item, idx) => {
            return <VideoSnippet displayVid={this.props.displayVid} key={idx} data={item}/>
            })    
          :
          <div className='default-search-results'>Search Results</div>
          }
        </div>
      </div>
    )
  }

}

export default VideoList;