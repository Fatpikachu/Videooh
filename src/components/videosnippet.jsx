import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';


class VideoSnippet extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }

  componentWillMount() {
    let link = {
      yt: `https://www.youtube.com/embed/${this.props.data.id}?autoplay=1`,
      dm: `https://www.dailymotion.com/embed/video/${this.props.data.id}?autoplay=1`,
      vm: `https://vimeo.com/${this.props.data.id}`
    }
    this.setState({link: link[this.props.data.source]})
  }
   
  render(){
    let description = this.props.data.description || '';
    description = description.length > 55
    ? description.substring(0, 55) + '...'
    : description;
    let title = this.props.data.title || '';
    title = title.length > 45
    ? title.substring(0, 45) + '...'
    : title;
    console.log('the link ====> ', this.state.link)
    return (  
      <div className={`video-snippet ${this.props.data.source}`} onClick={() => {this.props.displayVid(this.state.link)} } >
       <img className='video-img' src={this.props.data.thumbnail_120_url} alt=""/>
       <h4 className='snippet-title'>{title}</h4>
       <div className='snippet-description'>{description}</div>
      </div>
    )
  }

}

export default VideoSnippet;