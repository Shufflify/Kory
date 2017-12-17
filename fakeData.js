const faker = require('faker');
const fs = require('fs-extra');

const esClient = require('./db');

esClient.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});
// write fake playlists to playlists.txt
// var playlists = '';
// for (var i = 0; i < 1000000; i++) {
//   playlists = playlists + faker.random.number() + '|';
// }

// fs.writeFile('playlists.txt', playlists, err => {
//   err ? console.error(err) : console.log('successfully created playlists.txt');
// });

// // write fake users to users.txt
// var users = '';
// for (var i = 0; i < 1000000; i++) {
//   usersId = faker.random.number() + '|';
// }

// fs.writeFile('users.txt', users, err => {
//   err ? console.error(err) : console.log('successfully created users.txt');
// });

// // write fake song data to songs.txt
// var songs = '';
// for (var i = 0; i < 1000000; i++) {
//   songs = songs + faker.random.number() + '|';
// }

// fs.writeFile('songs.txt', songs, err => {
//   err ? console.error(err) : console.log('successfully created songs.txt');
// });
