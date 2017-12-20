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
  req.foundQuery = false;
  qClient.get(query, (err, queryResults) => {
    if (err) throw err;
    if (queryResults !== null) {
      req.queryResults = queryResults;
      res.json(queryResults); // TODO check Formatting
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

const updateCache = id => {
  // remove least recently used item from cache
  // add clicked playlist to cache
};

module.exports.checkQueries = checkQueries;
module.exports.getDefPlaylistIds = getDefPlaylistIds;
module.exports.updateCache = updateCache;
module.exports.pClient = pClient;
module.exports.qClient = qClient;
module.exports.checkPlaylists = checkPlaylists;