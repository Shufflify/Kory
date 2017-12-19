const express = require('express');
const path = require('path');

const db = require('../db');
const cache = require('../cache');

const app = express();

// on spotify open
app.get('/playlists/:userId', (req, res) => {
  const { userId } = req.params;
  let playlists = [];
  // get playlist data from AM
    .then(userPlaylists => playlists.concat(userPlaylists.userPlaylists))
    .then(() => // get default playlists from redis cache)
    .then(defaultPlaylists => res.json(playlists.concat(playlists)))
});

// on playlist click
app.get('/playlists/:playlistId', (req, res) => {
  const { playlistId } = req.params;
  cache.findPlaylist(playlistId)
    .then(playlistData => {
      // if (playlistData is a thing)
        // return playlistData
      // else 
        // get playlist info from AM
    })
    .then(playlistData => {
      // send SNS of songs to Streaming
      // res.json(playlistData)
    })
});

// on search
app.get('/search/:userId/:query', (req, res) => {
  const { userId, query } = req.params;
  cache.findQuery(query)
    .then(queryData => {
      // if (queryData is a thing)
        // return queryData
      // else {
        // return db.basicSearch(query)
      // }
    })
    .then(queryData => {
      res.json(queryData)
      // for songs in queryData
        // send SNS of top songIds to Streaming
      // for playlists in queryData
        // send SNS of playlist Ids to AM
    })
    .catch(err => console.error(err))
  // send SQS message to Events
});