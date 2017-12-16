const express = require('express');
const path = require('path');

const app = express();

// on spotify open
app.get('/playlists/:userId', (req, res) => {
  const { userId } = req.params;
});

// on playlist click
app.get('/playlists/:playlistId', (req, res) => {
  const { playlistId } = req.params;
});

// on search
app.get('/playlists/:userId/:query', (req, res) => {
  const { userId, query } = req.params;
});

// on play
app.get('/play/:songId', (req, res) => {
  const { songId } = req.params;
});

// on skip
app.get('/skip/:userId/:songId', (req, res) => {
  const { userId, songId } = req.params;
});