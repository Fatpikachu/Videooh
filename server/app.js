const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const app = express();
const port = 3000;
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const db = require('./database/index');
const exjwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const boom = require('boom');

const { accessToken, youtubeAPIKey, vimeoClientId, vimeoAccessToken, vimeoSecret, s3Key, s3ID } = require('../config/config.js')

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(vimeoClientId, vimeoSecret, vimeoAccessToken);

const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');


AWS.config.update({
  accessKeyId: s3ID,
  secretAccessKey: s3Key
});

AWS.config.setPromisesDependency(bluebird);

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'videooh-storage',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

app.post('/image-upload/:userID', (request, response) => {
  console.log('got inside /image-upload')
  var { userID } = request.params;
  const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        const fileName = `bucketFolder/${timestamp}-lg`;
        const data = await uploadFile(buffer, fileName, type);
        console.log('the data.location: ', data.Location)
        console.log('the userId: ', userID)
        console.log('the type of userId: ', typeof userID)
        db.User.update({imageurl: data.Location}, {where: {id: userID}})
        return response.status(200).send(data);
      } catch (error) {
        return response.status(400).send(error);
      }
    });
});


app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await db.User.findOne({ where: { email } });
  if (user) res.sendStatus(400); 
 
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.User.create({ username, email, password: hashedPassword });
  res.json(newUser);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ where: { email } });
  if (!user) res.sendStatus(400); 

  const authorized = await bcrypt.compare(password, user.password);
  if (!authorized) res.sendStatus(400);

  const token = jwt.sign({ id: user.id, username: user.username, imageurl: user.imageurl }, 'secret', { expiresIn: 129600 });
  res.json(token);
});

app.post('/updateprofile/:userID', async (req, res) => {
  const { pw, email, username } = req.body;
  const id = req.params.userID;
  console.log('the body: ', req.body);
  if(email){
    let updateEmail = await db.User.update({ email }, {where: { id }})
  } 
  if (pw){
    const hashedPassword = await bcrypt.hash(pw, 10);
    let updatePW = await db.User.update({ password: hashedPassword }, {where: { id }})
  }
  if(username){
    let updateUsername = await db.User.update({ username }, {where: { id }})
  }
  res.json({ username });
})

app.get('/myIG', async (req, res) => {
  const url = `https://api.instagram.com/v1/users/self/?access_token=${accessToken}`
  const iceCream = await fetch(url, {
    method: 'GET',
  })
  var apple = await iceCream.json()
  res.json(apple)
})

app.get('/searchVids', async (req, res) => {
  const url = `https://www.googleapis.com/youtube/v3/search?` +
    `q=${req.query.q}` +
    `&key=${youtubeAPIKey}` +
    `&maxResults=5` +
    `&part=snippet` +
    `&pageToken=${req.query.pageToken}`+
    `&type=video`
  const ytVids = await fetch(url, {
    method: 'GET',
  })

  const url2 = `https://api.dailymotion.com/videos/?country=us` +
    `&search=${req.query.q}`+
    `&limit=5` +
    `&page=${req.query.dmPage}` +
    `&fields=id,title,owner,description,thumbnail_120_url`

  const dmVids = await fetch(url2, {
    method: 'GET',
  })

  let vimeoData = new Promise((resolve, reject) => {
    client.request({
      method: 'GET',
      path: '/videos',
      query: {
        page: req.query.dmPage,
        per_page: 5,
        query: req.query.q,
        fields: 'uri,name,description,duration'
      }
    }, function (error, body, status_code, headers) {
      if (error) {
        console.log(error);
      }
      resolve(body);
    })})
    
    vimeoData = await vimeoData;

    vimeoData = vimeoData.data.map(async info => {
      let thumbnail = new Promise((resolve, reject) => {
      client.request({
        method: 'GET',
        path: `${info.uri}/pictures/`,
      }, function (error, body, status_code, headers) {
        if (error) {
          console.log(error);
        }
        resolve(body);
      })})
      thumbnail = await thumbnail;
      return { description: info.description,
        id: info.uri.slice(8),
        title: info.name,
        thumbnail_120_url: thumbnail.data[0].sizes[2].link, 
        source: 'vm' }
    })
    vmData = await Promise.all(vimeoData);
    var yt = await ytVids.json();
    var dm = await dmVids.json();

    let vids = { yt, dm, vmData }
    res.json(vids);
})

const server = app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});

module.exports = app;