const faker = require('faker');
const fs = require('fs-extra');

// write fake playlistIds to playlistId.txt
var str = '';
for (var i = 0; i < 10; i++) {
  str = str + faker.random.number() + '|';
}

// fs.writeFile('playlistIds.txt', str, (err) => {
//   err ? console.error(err) : console.log('successfully created playlistIds.txt')
// }
console.log(typeof str)