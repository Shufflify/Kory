const express = require('express');
const path = require('path');

const db = require('../db');
const cache = require('../cache');

const app = express();

// on spotify open
app.get('/playlists/:userId', (req, res) => {
  const { userId } = req.params;
  let userPlaylists = [];
  // get user playlist data from AM
    .then(playlists => userPlaylists.concat(playlists.userPlaylists))
    .then(() => cache.getDefPlaylistIds()) // get default playlist ids from redis cache
    .then(defPlaylistIds => db.getPlaylists())
    .then(defaultPlaylists => res.json({ userPlaylists, defaultPlaylists }))
});

// on playlist click
app.get('/playlists/:playlistId', cache.checkPlaylists(), (req, res) => {
  const { playlistId } = req.params;
  // TODO: update cache with clicked playlist info
  if (req.songIds) {
    // send SNS message containg req.songIds to Streaming
  } else {
    // send playlistId to AM => get playlist data from AM
      .then(playlistData => {
        // res.json(playlistData)
        // cache.updatePlaylistCache(playlistData)
      })
  }
});

// on search
app.get('/search/:userId/:query', cache.checkQueries(), (req, res) => {
  const { userId, query } = req.params;
  if (!req.queryResults) {
    // TODO not sure if im using promise.resovle correctly
    Promise.resolve(db.basicSearch(query)
      .then(queryResults => {
        req.queryResults = queryResults;
        res.json(queryResults);
      })
      .catch(err => console.error(err)))
  }
  // ONCE THE ABOVE IS DONE:
  // cache.updateQueryCache(req.queryResults)
  // for songs in req.queryResults
    // send SNS of top songIds to Streaming
  // for playlists in req.queryResults
    // send SNS of playlist Ids to AM
  // send SQS message to Events
});