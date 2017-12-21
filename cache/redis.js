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
        res.json(songIds); // TODO check formatting
      } 
    });
  }
  next();
};

const checkQueries = (req, res, next) => {
  const { query } = req.params;
  qClient.get(query, (err, queryData) => {
    if (err) throw err;
    if (queryData !== null) {
      req.queryData = queryData;
      res.json(queryData); // TODO check Formatting
    }
  }).then(() => next());
};

const getDefPlaylistIds = () => {
  pClient.hgetall('defaultPlaylists', (err, defPlaylists) => {
    if (err) throw err;
    let ids = [];
    for (id in defPlaylists) {
      ids.push(id);
    }
    return ids;
  });
};

const updatePlaylistCache = playlist => {
  return Promise.resolve(pClient.hset('lruPlaylists', playlist.id, playlist.songIds))
    .then(reply => console.log(reply))
    .catch(err => console.error(err));
};

const updateQueryCache = queryData => {
  // add queryData to cache
  // const { playlists, songs } = queryData.keyword
  // qClient.hmset('keyword', queryData.keyword, playlists, songs )
};

module.exports.updatePlaylistCache = updatePlaylistCache;
module.exports.updateQueryCache = updateQueryCache;
module.exports.checkQueries = checkQueries;
module.exports.getDefPlaylistIds = getDefPlaylistIds;
module.exports.updateCache = updateCache;
module.exports.pClient = pClient;
module.exports.qClient = qClient;
module.exports.checkPlaylists = checkPlaylists;