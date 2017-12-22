const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

// create the playlists and songs indices
const createIdx = index => {
  client.indices.create({ index }, (err, resp, status) => {
    err ? console.error(err) : console.log('created', resp);
  });
};

const deleteIndices = indices => {
  client.indices.delete({ index: indices }, (err, resp) => {
    err ? console.error(err) : console.log('deleted', resp);
  });
};

deleteIndices('*')

const basicSearch = q => client.search({ q }).then(res => res.hits.hits);
const getPlaylist = id => {
  let params = { index: 'playlists', type: 'playlist', id };
  return new Promise((resolve, reject) => {
    client.get(params, (err, playlist) => {
      err ? reject(err) : resolve(playlist._source);
    });
  });
};
const getPlaylists = playlistIds => Promise.all(playlistIds.map(id => getPlaylist(id)));

const getIdsFromResults = (query, queryResults) => {
  let queryResultIds = { keyword: query, playlistIds: [], songIds: [] };
  return queryResults.reduce((acc, result) => {
    if (result._index === 'playlists') {
      acc.playlistIds.push(result._id);
    } else if (result._index === 'songs') {
      acc.songIds.push(result._id);
    }
    return acc;
  }, queryResultIds);
};

const formatResultsForUser = queryResults => {
  let userResults = { playlists: [], songs: [] };
  return queryResults.reduce((acc, result) => {
    if (result._index === 'playlists') {
      acc.playlists.push(result._source);
    } else if (result._index === 'songs') {
      acc.songs.push(result._source);
    }
    return acc;
  }, userResults);
};
// getPlaylists([8,4,5,6,33,5688]).then(res => console.log(res))
// basicSearch('business').then(res => getIdsFromResults('business', res)).then(newRes => console.log(newRes));
// basicSearch('business').then(res => formatResultsForUser(res)).then(yea => console.log(yea))

module.exports.formatResultsForUser = formatResultsForUser;
module.exports.getIdsFromResults = getIdsFromResults;
module.exports.getPlaylist = getPlaylist;
module.exports.getPlaylists = getPlaylists;
module.exports.basicSearch = basicSearch;
module.exports.createIdx = createIdx;
module.exports.deleteIndices = deleteIndices;
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