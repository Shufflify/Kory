const chai = require('chai');
const mocha = require('mocha');
const request = require('supertest');

const app = require('../server/index.js').app;

// on playlist click
describe('GET /playlists/:userId', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/playlists/:userId') // change playlistId to a number in db
      .expect('Content-Type', /json/) // change
      .expect(200, done);
  });
  it()
});

describe('GET /playlists/:playlistId', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/playlists/:playlistId') // change playlistId to a number in db
      .expect('Content-Type', /json/) // change
      .expect(200, done);
  });
  it()
});

describe('GET /search/:userId:query', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/search/:userId:query') // change playlistId to a number in db
      .expect('Content-Type', /json/) // change
      .expect(200, done);
  });
  it()
});
