const express = require('express');
const path = require('path');
const aws = require('../helpers/aws.js');

const db = require('../db');
const cache = require('../cache');

const app = express();

// on spotify open
app.get('/playlists/:userId', (req, res) => {
  const { userId } = req.params;
  let userPlaylists = [];
  // get user playlist data from AM. make a separate get req? 
    .then(playlists => userPlaylists.concat(playlists.userPlaylists))
    .then(() => cache.getDefPlaylistIds()) // get default playlist ids from redis cache
    .then(defaultPlaylistIds => db.getPlaylists())
    .then(defaultPlaylists => res.json({ userPlaylists, defaultPlaylists }))
});

// on playlist click
app.get('/playlists/:playlistId', cache.checkPlaylists(), (req, res) => {
  const { playlistId } = req.params;
  let playlist = {id: playlistId}
  if (req.songIds) {
    playlist.songs = req.songIDs;
    // send SNS message containing req.songIds to Streaming
  } else {
    // send playlistId to AM => get playlist data from AM
      .then(playlistData => {
        // res.json(playlistData)
        // playlist.songs = playlistData.songs
      })
  }
  cache.updatePlaylistCache(playlist)
});

// on search
app.get('/search/:userId/:query', cache.checkQueries(), async (req, res) => {
  const { userId, query } = req.params;
  if (!req.queryResults) {
    await db.basicSearch(query)
      .then(queryResults => req.queryResults = queryResults)
      .then(() => db.formatResultsForUser(req.queryResults)
      .then(formattedResults => res.json(formattedResults))
      .catch(err => console.error(err))
  }
  db.getIdsFromResults(query, req.queryResults)
  cache.updateQueryCache(query, req.queryResults)
  // send SNS of req.queryResults.songIds to Streaming
  // send SNS of req.queryResults.playlistIds to AM
  // send SQS message to Events
  aws.saveQuery(userId, query);
});

module.exports.app = app;