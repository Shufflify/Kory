const expect = require('chai').expect;
// const mocha = require('mocha');
const assert = require('assert');
const request = require('supertest');
// const app = require('../server/index.js').app;
const db = require('../db/index.js');

// on playlist click
xdescribe('GET /playlists/:userId', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/playlists/:userId') // change playlistId to a number in db
      .expect('Content-Type', /json/) // change
      .expect(200, done);
  });
});

xdescribe('GET /playlists/:playlistId', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/playlists/:playlistId') // change playlistId to a number in db
      .expect('Content-Type', /json/) // change
      .expect(200, done);
  });
});

xdescribe('GET /search/:userId:query', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/search/:userId:query') // change playlistId to a number in db
      .expect('Content-Type', /json/) // change
      .expect(200, done);
  });
});

describe('basicSearch function', function() {
  before(async function() { 
    await db.basicSearch('business')
      .then(res => { 
        const searchResults = res;
        return;
      });
  });
  // console.log(searchResults)
  it('should return an object', function() {
    expect(searchResults.timed_out).to.be.false;
  });
});
