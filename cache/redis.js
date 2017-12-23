const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);

const pClient = redis.createClient();
pClient.on('connect', () => console.log('connected to redis playlist cache'));

const qClient = redis.createClient();
qClient.on('connect', () => console.log('connected to redis query cache'));

const pCaches = ['defaultPlaylists', 'lruPlaylists'];

const checkPlaylists = (req, res, next) => {
  pClient.hgetAsync('lruPlaylists', req.params.playlistId)
    .tap(songIds => { req.songIds = songIds; })
    .then(songIds => { if (songIds !== null) throw songIds }) //eslint-disable-line
    .then(songIds => pClient.hgetAsync('defaultPlaylists', req.params.playlistId))
    .tap(songIds => { req.songIds = songIds; })
    .then(songIds => { if (songIds !== null) throw songIds }) //eslint-disable-line
    // TODO: if i find a playlist im throwing into into the catch block, but what about errors?
    .catch(songIds => res.json(songIds))
    .then(() => next());
};

const checkQueries = (req, res, next) => {
  qClient.getAsync(req.params.query)
    .tap(queryResults => { if (queryResults === null) throw 'Query Not Found'; }) //eslint-disable-line
    .tap(queryResults => res.json(queryResults))
    .then(queryResults => { req.queryResults = queryResults; })
    .then(() => next())
    .catch(err => next(err));
};

const getDefaultPlaylistIds = () => {
  return pClient.hgetallAsync('defaultPlaylists')
    .then(playlists => Object.keys(playlists))
    .catch(err => 'error getting default playlist ids', err);
};

const updatePlaylistCache = playlist => pClient.hsetAsync('lruPlaylists', playlist.id, playlist.songs);

const updateQueryCache = (query, queryResults) => {
  const { playlistIds, songIds } = queryResults;
  return qClient.hmsetAsync(query, 'playlists', playlistIds, 'songs', songIds);
};

// getDefaultPlaylistIds().then(res => console.log('HEY THERE',res));
// checkPlaylists({params: {playlistId:5}}, {}, () => {})
// updateQueryCache('business', {playlistIds: [1,2,3,4], songIds: [5,6,7,8]}).then(res => console.log('RES', res))

module.exports.updatePlaylistCache = updatePlaylistCache;
module.exports.updateQueryCache = updateQueryCache;
module.exports.checkQueries = checkQueries;
module.exports.getDefaultPlaylistIds = getDefaultPlaylistIds;
module.exports.pClient = pClient;
module.exports.qClient = qClient;
module.exports.checkPlaylists = checkPlaylists;