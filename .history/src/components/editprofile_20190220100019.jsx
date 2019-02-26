import React, {Component} from 'react';
import ApiService from '../services/ApiService.js';
import AuthService from '../services/AuthService.js';


class EditProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: null,
      pwMatch: true,
      profilePic: localStorage.getItem('imageurl'),
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleFileUpload = (event) => {
    var file = this.refs.imageUploader.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);

    reader.onloadend = (e) => {
        this.setState({
          profilePic: [reader.result],
          file: file
        })
    }
  }

  updateProfilePic = () => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let id = localStorage.getItem('userID');
      fetch(`http://localhost:3000/image-upload/${id}`, {
        method: 'POST',
        body: formData
      }).then((res) => 
        res.json()
      ).then(res => {
        localStorage.setItem('imageurl', res.Location)
        resolve();
      })
      .catch((err)=>{
        console.log('error uploading: ', err)
      }); 
    })
  }

  updateProfile = (pw, email, username) => {
    return new Promise((resolve, reject) => {
      let id = localStorage.getItem('userID');
      ApiService.updateProfile(pw, email, username, id)
        .then((res)=>{
          localStorage.setItem('username', res.username)
          resolve();
        })
    })
  }

  submitFile = async (event) => {
    event.preventDefault();
    let { newPW1, newPW2, email, userName } = this.state
    if(newPW1 !== newPW2){
      this.setState({pwMatch: false});
      return
    }
    if(newPW1 || email || userName){
      let updateprofile = await this.updateProfile(newPW1, email, userName);
    }
    if(this.state.file){
      let pic = await this.updateProfilePic();
    }
    this.props.history.replace('/homepage');
  }

  removePhoto = () => {
    this.refs.removePhoto.setAttribute("disabled", "disabled");
  }

  cancel = () => {
    this.props.history.replace('/homepage');
  }

  uploadPhoto = () => {
    this.refs.imageUploader.click();
  }

  render(){
    return (
    <div>
      <form onSubmit={this.submitFile}>
        <img className='profile-pic' src={this.state.profilePic} />
        <br/>
        <input label='upload file' type='file' ref='imageUploader' onChange={this.handleFileUpload} style={{display: 'none'}}/>
        <br/>
        <div className='photo-btns'>
          <button type='button' ref='uploadPhoto' className="btn upload-photo"
            onClick={this.uploadPhoto}><i className="fa fa-folder"></i> Upload Photo</button>
          <button type='button' ref='removePhoto' className="btn remove-photo"
            onClick={this.removePhoto}><i className="fa fa-trash"></i> Remove Current Photo</button>
        </div>
        <br/>
        <input className="update-input" name="email" type="text"  onChange={this.handleChange} />
        <span className="floating-label">Update Email Address</span>
        <br/>
        <input className="update-input" name="userName" type="text"  onChange={this.handleChange} />
        <span className="floating-label">Change Username</span>
        <br/>
        <input className="update-input" name="newPW1" type="text" onChange={this.handleChange} />
        <span className="floating-label">New Password</span>
        <br/>
        <input className="update-input" name="newPW2" type="text" onChange={this.handleChange} />
        <span className="floating-label">Confirm Password</span>
        <br/>
        <button type='submit' className="submit" >Save Changes</button>
        <button className="cancel" onClick={this.cancel}> Cancel </button>
      </form>
      <br/>
      {
        !this.state.pwMatch
        ? <span>Passwords do not match</span>
        : null
      }
    </div>
    )
  }

}

export default EditProfile;