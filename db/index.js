const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

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


// create the ___ index
// 1 index with different posts or playlist idx, song idx ???
const indices = ['playlists', 'songs'];
for (index of indices) {
  // check if index already exists
  client.indices.create({ index }, (err, resp, status) => {
    if (err) {
      console.log(err);
    } else {
      console.log('create', resp);
    }
  });
}

// client.search({
//   q: 'bo burnham'
// }).then(body => {
//   const hits = body.hits.hits;
// }, err => {
//   console.trace(err.message);


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
module.exports = client;