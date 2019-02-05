import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';



class VideoPlayer extends Component {
  constructor(props){
    super(props);
    this.state = {
   
    }
  }

   
  render(){
    return (
      <iframe className='video-player' width="800" height="600"
        src={this.props.link}>
      </iframe>
    )
  }

}

export default VideoPlayer;