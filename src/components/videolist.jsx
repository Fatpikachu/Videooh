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

  nextPage = () => {
    this.props.searchVideos(this.props.searchWords, this.props.nextPageToken, 'up')
  }

  prevPage = () => {
    this.props.searchVideos(this.props.searchWords, this.props.prevPageToken, 'down')
  }
   
  componentWillMount(){

  }

  render(){
    let ytData = []
    let dmData = this.props.dmData || [];
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
    let allData = ytData.concat(dmData)
    console.log('the allData: ', allData)
    return (
      <div>
        <div className='paginate'>
        <button onClick={this.prevPage}> &lt; </button>
        <button onClick={this.nextPage}> &gt; </button>
        </div>
        <div className='video-list'>
          {
          allData.length > 0
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