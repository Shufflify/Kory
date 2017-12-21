const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});



// create the playlists and songs indices
const indices = ['playlists', 'songs'];
const createIdx = index => {
  // check if index already exists TODO
  client.indices.create({ index }, (err, resp, status) => {
    if (err) {
      console.log(err);
    } else {
      console.log('create', resp);
    }
  });
};

const basicSearch = q => client.search({ q }).then(results => console.log(results));
const getPlaylists = playlistIds => {
  let playlists = [];
  for (id of playlistIds) {
    client.get({
      index: 'playlists',
      type: 'playlist',
      id: id
    }).then((err, resp) => {
      console.log(resp);
      // playlists.push(body) push playlist data to playlists
    });
  }
  return playlists;
};

module.exports.getPlaylists = getPlaylists;
module.exports.basicSearch = basicSearch;
module.exports.createIdx = createIdx;
module.exports.client = client;
// .then(body => {
//   const hits = body.hits.hits;
// }, err => {
//   console.trace(err.message);


// client.ping({
//   // ping usually has a 3000ms timeout
//   requestTimeout: 15000
// }, err => {
//   if (err) {
//     console.error('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });
// // If you want to have a fine-grained control over document search, Elasticsearch offers a query DSL.
// client.search({
//     index: 'blog',
//     type: 'posts',
//     body: {
//         query: {
//             match: {
//                 "PostName": 'Node.js'
//             }
//         }
//     }
// }).then(function(resp) {
//     console.log(resp);
//     // success looks like this: 
//       // { took: 407,
//       //   timed_out: false,
//       //   _shards: { total: 4, successful: 4, failed: 0 },
//       //   hits: { total: 1, max_score: 0.26742277, hits: [ [Object] ] } }
// }, function(err) {
//     console.trace(err.message);
// });

// prevent 404 responses from being considered errors by telling client to ignore
// client.indices.delete({
//   index: 'playlists',
//   ignore: [404]
// }).then(function (body) {
//   // since we told the client to ignore 404 errors, the
//   // promise is resolved even if the index does not exist
//   console.log('index was deleted or never existed');
// }, function (error) {
//   // oh no!
// });

// // Use wildcard searches and regular expressions.
// // query for all matches where ‘.js’ is preceded by four characters:
// query: { wildcard: { "PostBody": "????.js" } }