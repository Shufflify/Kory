const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({ host: 'localhost:9200' });

const createIdx = index => {
  return client.indices.create({ index })
    .then(resp => console.log(`successfully created ${index} index`))
    .catch(err => console.error(`error creating ${index} index`, err));
};

const deleteIndices = indices => {
  return client.indices.delete({ index: indices })
    .then(resp => console.log(`successfully deleted ${indices} indices`))
    .catch(err => console.error(`error deleting ${indices} indices`, err));
};

const basicSearch = q => client.search({ q }).then(res => res.hits.hits);

const getPlaylist = id => {
  let params = { index: 'playlists', type: 'playlist', id };
  return client.get(params)
    .then(playlist => playlist._source)
    .catch(err => console.error(`error getting playlist with id ${id}`, err));
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