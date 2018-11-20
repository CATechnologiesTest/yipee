const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs');

chai.use(chaiAsPromised);
chai.use(chaiHttp);

function assertExpectedYipee(yipeeobj) {
    let flatFile = yipeeobj.flatFile;
    expect(flatFile).to.not.be.null;
    expect(flatFile).to.not.be.undefined;
    expect(flatFile.image.length).to.equal(1);
    let svcnames = flatFile.container.map(c => c.name);
    expect(svcnames.length).to.equal(1);
    expect(svcnames).to.contain.members(["one"]);
    expect(flatFile.volume.length).to.equal(1);
    expect(flatFile.volume[0].name).to.equal("vol1");
    expect(flatFile['volume-ref'].length).to.equal(1);
    expect(flatFile['volume-ref'][0]['volume-name']).to.equal("vol1");
}

describe('Import Tests', function() {
    this.timeout(100000);

    after(function(done) {
        if (app.server) {
            app.server.close();
        }
        done();
    });

    let testK8sImport = function() {
        describe('#testImport', function() {
            it('should import k8s and return flat', function(done) {
                // create initial yipee
                chai.request(app.server)
                    .post('/import')
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .send(importBundle)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body.success).to.equal(true);
                        let yipeeobj = res.body.data[0];
                        assertExpectedYipee(yipeeobj);
                        done();
                    })
                    .catch(err => {
                        console.log("test k8s import error: %j", err);
                        done(err);
                    });
            });
        });
    }

    let importBundle = {
        name: 'bundleImport',
        isPrivate: true,
        importFile: fs.readFileSync(
            'test/testAssets/simpleK8sBundle.tgz').toString('base64')
    };

    let importFile = {
        name: 'fileImport',
        isPrivate: true,
        importFile: fs.readFileSync(
            'test/testAssets/simpleK8sApp.yaml').toString('base64')
    };

    testK8sImport(importBundle);
    testK8sImport(importFile);
});

function assertExpectedGuid(yipeeobj) {
    let guid = yipeeobj.guid;
    expect(guid).to.not.be.null;
    expect(guid).to.not.be.undefined;
    expect(guid).to.be.a('string');
    expect(guid).to.have.lengthOf(36);
}

describe('Import Returning GUIDs Test', function() {
    this.timeout(100000);

    after(function(done) {
        if (app.server) {
            app.server.close();
        }
        done();
    });
    let testK8sImportGuid = function() {
        describe('#testImportGuid', function() {
            it('should import k8s and return flat', function(done) {
                // create initial yipee
                var agent = chai.request.agent(app.server);
                agent
                    .post('/import?store=true')
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .send(importBundle)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body.success).to.equal(true);
                        let yipeeobj = res.body.data[0];
                        assertExpectedGuid(yipeeobj);
                        return agent
                            .get('/import/' + yipeeobj.guid)
                            .set('content-type', 'applicaiton/json')
                            .set('accept', 'application/json')
                            .then(res1 => {
                                expect(res1).to.have.status(200);
                                expect(res1).to.be.json;
                                expect(res1.body.success).to.equal(true);
                                done();
                            })
                            .catch(err => {
                                console.log("test k8s import error: %j", err);
                                done(err);
                            });
                    });
            });
        });

    let importBundle = {
        name: 'bundleImport',
        isPrivate: true,
        importFile: fs.readFileSync(
            'test/testAssets/simpleK8sBundle.tgz').toString('base64')
    };

    let importFile = {
        name: 'fileImport',
        isPrivate: true,
        importFile: fs.readFileSync(
            'test/testAssets/simpleK8sApp.yaml').toString('base64')
    };

    testK8sImportGuid(importBundle);
    testK8sImportGuid(importFile);
    }});
