const faker = require('faker');

const db = require('./index.js');

const esClient = db.client;

// elasticsearch db indices
const indices = ['playlists', 'songs'];

// this function needs to complete before generating fake data
// THIS IS NOT WORKING, FIGURE IT OUT
async function initialize() {
  return esClient.exists({ index: indices[0]})
    .then(exists => exists && db.deleteIndices('*'))
    .then(() => indices.forEach(idx => db.createIdx(idx)))
    .catch(err => console.log('error', err))



  //     , (err, exists) => {
  //   if (exists === true) {
  //     // drop all indices if one exists
  //     db.deleteIndices('*');
  //   }
  //   // instantiate new indices
  //   indices.forEach(idx => db.createIdx(idx));
  // });
};

initialize()
 
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
  songs.push({ id: i, title: word(), artist: `${firstName()} ${lastName()}`, album: word(), duration: '3:00' });
}

// seed songs index
esClient.bulk({ body: songs }, (err, resp) => {
  if (err) { 
    console.error(err);
  } else {
    console.log(resp);
  }
});







