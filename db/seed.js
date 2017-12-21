// const fs = require('fs-extra');
const faker = require('faker');

const es = require('./index.js');
const esClient = es.client;

// instantiate song and playlist indices
const indices = ['playlists', 'songs'];
for (index of indices) {
  // check if index already exists
  esClient.indices.create({ index }, (err, resp, status) => {
    if (err) {
      console.log(err);
    } else {
      console.log('create', resp);
    }
  });
}

const id = faker.random.number;
const word = faker.random.word;
const sentence = faker.lorem.sentence;
const firstName = faker.name.firstName;
const lastName = faker.name.lastName;

// create playlist data
let playlists = [];
for (var i = 0; i < 10000; i++) {
  let playlistIdx = { index: { _index: 'playlists', _type: 'playlist', _id: i } };
  playlists.push(playlistIdx);
  playlists.push({ id: i, name: word(), description: sentence() });
}

// seed playlists index
esClient.bulk({ body: playlists }, (err, resp) => {
  if (err) { 
    console.error(err);
  } else {
    console.log(resp);
  }
});

// create song data
let songs = [];
for (var i = 0; i < 10000; i++) {
  let songIdx = { index: { _index: 'songs', _type: 'song', _id: i } };
  songs.push(songIdx);
  songs.push({ id: i, title: word(), artist: `${firstName()} ${lastName()}`, album: word() });
}

// seed songs index
esClient.bulk({ body: songs }, (err, resp) => {
  if (err) { 
    console.error(err);
  } else {
    console.log(resp);
  }
});








