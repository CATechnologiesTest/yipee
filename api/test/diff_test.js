const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const fs = require('fs');
chai.use(chaiAsPromised);
chai.use(chaiHttp);
const app = require('../app');

function logAndThrow(err) {
    console.log(err);
    throw err;
}

describe('Yipee Diff API Tests:', function() {
    this.timeout(60000);

    after(function(done) {
        if (app.server) {
            app.server.close();
        }
        done();
    });

    let flat = fs.readFileSync('test/testAssets/simpleK8sApp.flat.json');
    let flatJson = JSON.parse(flat);
    let yaml = fs.readFileSync('test/testAssets/simpleK8sApp.yaml', 'utf-8');

    function diffTest(payload) {
        describe('#diffTest', function() {
            it('should diff the posted files', function(done) {
                let url = '/diff';
                chai.request(app.server)
                    .post(url)
                    .set('content-type', 'application/json')
                    .send(payload)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        // console.log("diff return:", res.body.data[0]);
                        done();
                    })
                    .catch(err => {
                        console.log("test diff error: %j", err);
                        done(err);
                    });
            });
        });
    }

    diffTest({
        parent: {
            name: 'parent-flat',
            data: flatJson
        },
        children: [{
            name: 'child-yaml',
            data: yaml
        }]
    });

    diffTest({
        parent: {
            name: 'parent-yaml',
            data: yaml
        },
        children: [{
            name: 'child-flat',
            data: flatJson
        }]
    });

    diffTest({
        parent: {
            name: 'parent-yaml',
            data: yaml
        },
        children: [{
            name: 'child-yaml',
            data: yaml
        }]
    });

    diffTest({
        parent: {
            name: 'parent-flat',
            data: flatJson
        },
        children: [{
            name: 'child-flat',
            data: flatJson
        }]
    });

    function badDiffInput(payload) {
        describe('#badDiffInput', function() {
            it('should fail diff with bad input', function(done) {
                let url = '/diff';
                chai.request(app.server)
                    .post(url)
                    .set('content-type', 'application/json')
                    .send(payload)
                    .then(res => {
                        expect(res).to.have.status(400);
                        expect(res).to.be.json;
                        console.log("diff input error (expected): ",
                                    res.body.data[0]);
                        done();
                    })
                    .catch(err => {
                        console.log("bad diff input error: %j", err);
                        done(err);
                    });
            });
        });
    }

    badDiffInput({
        parent: "I'm the parent",
        children: "just me"
    });

    badDiffInput({
        parent: "I'm the parent",
        children: ["just me"]
    });

    badDiffInput({
        parent: {name: "nolan"},
        children: [{name: "dj", data: 10}]
    });

    function getResultGuid(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.success).to.equal(true);
        let yipeeobj = res.body.data[0];
        expect(yipeeobj.guid).to.not.be.null;
        expect(yipeeobj.guid).to.not.be.undefined;
        return yipeeobj.guid;
    }

    function expectGetResult(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.success).to.equal(true);
        expect(res.body.data[0]).to.have.property('flatFile');
    }

    function diffImports() {
        describe('#diffImports', function() {
            it('should diff imported files by guid', function(done) {
                let importPayload = {
                    importFile: yaml
                };
                let guid1, guid2;
                let diffPayload = {
                    parent: {name: "parent"},
                    children: [{name: "child"}]
                };
                chai.request(app.server)
                    .post('/import?store=true')
                    .set('content-type', 'application/json')
                    .send(importPayload)
                    .then(imp1 => {
                        guid1 = getResultGuid(imp1);
                        return chai.request(app.server)
                            .post('/import?store=true')
                            .set('content-type', 'application/json')
                            .send(importPayload);
                    })
                    .then(imp2 => {
                        guid2 = getResultGuid(imp2);
                        diffPayload.parent.data = guid1;
                        diffPayload.children[0].data = guid2;
                        return chai.request(app.server)
                            .post('/diff')
                            .set('content-type', 'application/json')
                            .send(diffPayload);
                    })
                    .then(diffres => {
                        expect(diffres).to.have.status(200);
                        expect(diffres).to.be.json;
                        console.log("diff guids:", diffres.body.data[0]);
                        diffPayload.parent.data =
                            '12345678-0000-9999-aBcD-ABCDEFabcdef';
                        return chai.request(app.server)
                            .post('/diff')
                            .set('content-type', 'application/json')
                            .send(diffPayload);
                    })
                    .then(baddiff => {
                        expect(baddiff).to.have.status(400);
                        expect(baddiff).to.be.json;
                        expect(baddiff.body.success).to.equal(false);
                        console.log("baddiff:", baddiff.body.data[0]);
                        return chai.request(app.server)
                            .get('/import/' + guid1)
                            .set('accept', 'application/json');
                    })
                    .then(get1 => {
                        expectGetResult(get1);
                        return chai.request(app.server)
                            .get('/import/' + guid2)
                            .set('accept', 'application/json');
                    })
                    .then(get2 => {
                        expectGetResult(get2);
                        done();
                    })
                    .catch(err => {
                        console.log("test diff error: %j", err);
                        done(err);
                    });
            });
        });
    }

    diffImports();
});
