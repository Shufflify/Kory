const redis = require('redis');

const pClient = redis.createClient();
pClient.on('connect', () => console.log('connected to redis playlist cache'));

const qClient = redis.createClient();
qClient.on('connect', () => console.log('connected to redis query cache'));

const pCaches = ['defaultPlaylists', 'lruPlaylists'];

const checkPlaylists = (req, res, next) => {
  const { playlistId } = req.params;
  for (cache of pCaches) {
    pClient.hget(cache, playlistId, (err, songIds) => {
      if (err) throw err;
      if (songIds !== null) {
        req.songIds = songIds;
        console.log('songsIds',songIds)
        // res.json(songIds); // TODO check formatting
      } 
    });
  }
  next();
};

const checkQueries = (req, res, next) => {
  const { query } = req.params;
  qClient.get(query, (err, queryResults) => {
    if (err) throw err;
    if (queryResults !== null) {
      req.queryResults = queryResults;
      res.json(queryResults); // TODO check Formatting
    }
  }).then(() => next());
};

const getDefaultPlaylistIds = () => {
  return new Promise((resolve, reject) => {
    pClient.hgetall('defaultPlaylists', (err, defPlaylists) => {
      if (err) reject(err);
      let ids = [];
      for (id in defPlaylists) {
        ids.push(id);
      }
      resolve(ids);
    });
  });
};

const updatePlaylistCache = playlist => {
  return Promise.resolve(pClient.hset('defaultPlaylists', playlist.id, playlist.songIds))
    .then(reply => console.log(reply))
    .catch(err => console.error(err));
};

const updateQueryCache = (query, queryResults) => {
  // add queryData to cache
  const { playlistIds, songIds } = queryResults;
  return Promise.resolve(qClient.hmset(query, 'playlists', playlistIds, 'songs', songIds));
};

const formatResultsForUser = queryResults => {

}

// updatePlaylistCache({id: 7, songIds: [4,7,2,34]}).then(res => console.log('RES',res));
// getDefaultPlaylistIds().then(res => console.log(res));
// checkPlaylists({params: {playlistId:5}}, {}, () => {})
updateQueryCache('business', {playlistIds: [1,2,3,4], songIds: [5,6,7,8]}).then(res => console.log('RES', res))

module.exports.formatResultsForUser = formatResultsForUser;
module.exports.updatePlaylistCache = updatePlaylistCache;
module.exports.updateQueryCache = updateQueryCache;
module.exports.checkQueries = checkQueries;
module.exports.getDefaultPlaylistIds = getDefaultPlaylistIds;
module.exports.pClient = pClient;
module.exports.qClient = qClient;
module.exports.checkPlaylists = checkPlaylists;