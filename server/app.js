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
const { accessToken, youtubeAPIKey } = require('./config.js')
const fetch = require('node-fetch');

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
  var yt = await ytVids.json();
  var dm = await dmVids.json();
  let vids = {yt, dm}
  res.json(vids);
})

const server = app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});

module.exports = app;
//https://www.googleapis.com/youtube/v3/search?q=one piece&
//key=AIzaSyBwdzYdi9k4ELXZcLyrmfY9jhM30voslxc&maxResults=10&part=snippet&type=video
