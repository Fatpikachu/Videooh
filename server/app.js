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
const boom = require('boom');
const { accessToken, youtubeAPIKey, vimeoClientId, vimeoAccessToken, vimeoSecret } = require('./config.js')
const fetch = require('node-fetch');

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(vimeoClientId, vimeoSecret, vimeoAccessToken);


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

  const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: 129600 });
  res.json(token);
})
,
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
        page: 1,
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