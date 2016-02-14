var request = require('supertest');
var express = require('express');
var xml = require('xml');

var app = express();

var addedDirectories = [];

/*
Simulate add directory post api
 */
app.post('/add-directory', function(req, res){

    res.set('Content-Type', 'text/xml');

    var directory = req.query.name;

    if(!directory) {
        var errorMessage = xml({
            error: [
                { code: '16' },
                { message: 'No file scheme specified in request' }
            ]
        });

        res.status(400).send(errorMessage);
    } else {

        if(_.includes(addedDirectories, directory)) {
            errorMessage = xml({
                error: [
                    { code: '13'},
                    { message: 'Directory with such name already'}
                ]
            });
            res.status(400).send(errorMessage);
        } else {
            addedDirectories.push(directory);
            res.status(200).send( xml({ success: '' }) );
        }
    }
});



describe('crowdin mock api', function() {

    before(function(done) {
        done();
    });

    beforeEach(function() {

    });

    it('POST /add-directory?name=app', function(done) {
        request(app)
            .post('/add-directory')
            .query('name=app')
            .expect('Content-Type', /text\/xml/)
            .expect(200, '<success></success>')
            .end(done);
    });

    it('POST /add-directory?name=app, caught directory already uploaded', function(done) {

        request(app)
            .post('/add-directory')
            .query('name=app')
            .expect(400, '<error><code>13</code><message>Directory with such name already</message></error>')
            .end(done);
    });

});