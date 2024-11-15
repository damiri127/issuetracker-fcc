const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { status } = require('express/lib/response');

chai.use(chaiHttp);


let issue1;
suite('Functional Tests', function() {
    suite('Check Create a new issue', function(){
        // Create an issue with every field: POST request to /api/issues/{project}
        test('Create an issue with every field', function(done){
            chai
                .request(server)
                .post('/api/issues/testing123')
                .set('content-type', 'application/json')
                .send({
                    issue_title: "Bugs in view",
                    issue_text: "Functional test",
                    created_by: "FCC",
                    assigned_to: "Arief",
                    status_text: "Not Done"
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    issue1 = res.body;
                    assert.equal(res.body.issue_title, "Bugs in view");
                    assert.equal(res.body.issue_text, "Functional test");
                    assert.equal(res.body.created_by, "FCC");
                    assert.equal(res.body.assigned_to, "Arief");
                    assert.equal(res.body.status_text, "Not Done");
                    done();
                })
        });
        // Create an issue with only required fields: POST request to /api/issues/{project}
        test('Create an issue with only required fields', function(done){
            chai
                .request(server)
                .post('/api/issues/testing123')
                .send({
                    issue_title: "Issue 2",
                    issue_text: "Functional test",
                    created_by: "Arief",
                    assigned_to: undefined,
                    status_text: undefined,
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "Issue 2");
                    assert.equal(res.body.issue_text, "Functional test");
                    assert.equal(res.body.created_by, "Arief");
                    done();
                })
        });
        // Create an issue with missing required fields: POST request to /api/issues/{project}
        test('Create an issue with any missing required fields', function(done){
            chai
                .request(server)
                .post('/api/issues/testing123')
                .send({
                    issue_title: undefined,
                    issue_text: undefined,
                    created_by: undefined,
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing")
                })
            done();
        });
    });
    
    suite('Check Get an issues', function(){
        // View issues on a project: GET request to /api/issues/{project}
        test('View issue on a project', function(done){
            chai
                .request(server)
                .get('/api/issues/testing123')
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    done();
                })
        });
        // View issues on a project with one filter: GET request to /api/issues/{project}
        test('View issue on a project with filter', function(done){
            chai
                .request(server)
                .get('/api/issues/testing123')
                .query({
                    _id: issue1._id,
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title, issue1.issue_title);
                    assert.equal(res.body[0].issue_text, issue1.issue_text);
                    done();
                })
        });
        // View issues on a project with multiple filters: GET request to /api/issues/{project}
        test('View issues on a project with mutiple filters', function(done){
            chai
                .request(server)
                .get('/api/issues/testing123')
                .query({
                    issue_title: issue1.issue_title,
                    issue_text: issue1.issue_text
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title, issue1.issue_title);
                    assert.equal(res.body[0].issue_text, issue1.issue_text);
                    done();
                })
        });
    });
    
    /* PUT METHOD */
    suite('Check PUT method to update data', function(){
        // Update one field on an issue: PUT request to /api/issues/{project}
        test('Update one field on an issue', function(done){
            chai
                .request(server)
                .put('/api/issues/testing123')
                .send({
                    _id: issue1._id,
                    issue_title: "Update issue title",
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, issue1._id);
                    done();
                })
        });
        // Update multiple fields on an issue: PUT request to /api/issues/{project}
        test('Update multiple field on an issue', function(done){
            chai
                .request(server)
                .put('/api/issues/testing123')
                .send({
                    _id: issue1._id,
                    issue_title: "Update issue title",
                    issue_text: "Check update issue"
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, issue1._id);
                    done();
                })
        });
        // Update an issue with missing _id: PUT request to /api/issues/{project}
        test('Update an issue without id', function(done){
            chai
                .request(server)
                .put('/api/issues/testing123')
                .send({
                    issue_title: "Update issue title",
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                })
        });
        // Update an issue with no fields to update: PUT request to /api/issues/{project}
        test('Update an issue with no fields to update', function(done){
            chai
                .request(server)
                .put('/api/issues/testing123')
                .send({
                    _id: issue1._id,
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "no update field(s) sent");
                    done();
                })
        });
        // Update an issue with an invalid _id: PUT request to /api/issues/{project}
        test('Update an issue with invalid id', function(done){
            chai
                .request(server)
                .put('/api/issues/testing123')
                .send({
                    _id: "6736fa7ffdsdadadadada",
                    issue_title: "Update issue title",
                    issue_text: "Check update issue"
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not update");
                    done();
                })
        });
    });

    suite('Check Delete an issue', function(){
        // Delete an issue: DELETE request to /api/issues/{project}
        test('Delete an issue', function(done){
            chai
                .request(server)
                .delete('/api/issues/testing123')
                .send({
                    _id: issue1._id
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted");
                    done();
                })
        });
        // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
        test('Delete with an invalid _id', function(done){
            chai
                .request(server)
                .delete('/api/issues/testing123')
                .send({
                    _id: "6736fa7ffdsdadadadada"
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not delete");
                    done();
                })
        });
        // Delete an issue with missing _id: DELETE request to /api/issues/{project}
        test('Delete an issue with missing _id', function(done){
            chai
                .request(server)
                .delete('/api/issues/testing123')
                .send({
                    _id: undefined
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                })
        });
    });
});
