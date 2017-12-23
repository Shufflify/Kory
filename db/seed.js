const faker = require('faker');

const db = require('./index.js');
const esClient = db.client;

// fake data
const id = faker.random.number;
const word = faker.random.word;
const sentence = faker.lorem.sentence;
const firstName = faker.name.firstName;
const lastName = faker.name.lastName;

const n = 100000; // number of entries per index to insert

// elasticsearch db indices
let indices = ['playlists', 'songs'];
let playlists = [];
let songs = []; 

const initialize = () => {
  return db.deleteIndices('*')
    .then(() => indices.forEach(idx => db.createIdx(idx)))
    .catch(err => console.log('error initializing seed', err));
};

const generatePlaylists = n => {
  // create playlist data
  for (var i = 0; i < n; i++) {
    let playlistIdx = { index: { _index: 'playlists', _type: 'playlist', _id: i } };
    playlists.push(playlistIdx);
    playlists.push({ id: i, name: word(), description: sentence() });
  }
};

const generateSongs = n => {
  // create song data
  for (var i = 0; i < n; i++) {
    let songIdx = { index: { _index: 'songs', _type: 'song', _id: i } };
    songs.push(songIdx);
    songs.push({ id: i, title: word(), artist: `${firstName()} ${lastName()}`, album: word(), duration: '3:00' });
  }
};

const insert = data => {
  return esClient.bulk({ body: data })
    .then(resp => console.log(`successfully seeded the db with ${indices.length * n} entries!`))
    .catch(err => console.error('failed to insert into db', err));
};

initialize()
  .then(() => generatePlaylists(n))
  .then(() => generateSongs(n))
  .then(() => insert(playlists.concat(songs)))
  .catch(err => console.error('error seeding database', err));
