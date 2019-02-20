import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';
import Vimeo from '@vimeo/player'



class VideoPlayer extends Component {
  constructor(props){
    super(props);
    this.state = {
   
    }
  }

  componentDidMount() {
    let videoPlayer;
    let link = this.props.link;
    if(link.slice(0, 13) === 'https://vimeo'){
      var options = {
        url: link,
        width: 800,
        height: 600,
        autoplay: true,
      }
      videoPlayer = new Vimeo('myVideo', options);
    }
  }

   
  render(){
    let link = this.props.link
    return (
      <div>
        {
        link.slice(0, 13) === 'https://vimeo'
        ? <div id='myVideo'></div>
        : link
        ? <iframe className='video-player' width="800" height="600" allowfullscreen="allowfullscreen"
          src={this.props.link}>
        </iframe>
        : <div id='no-vid'>No video selected</div>
        }
      </div>
    )
  }

}

export default VideoPlayer;