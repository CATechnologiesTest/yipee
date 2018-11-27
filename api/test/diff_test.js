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

    const diffTest = function(payload) {
        describe('#diffTest', function() {
            it('should diff the posted files', function(done) {
                let url = '/diff';
                let payload = {
                    parent: {
                        name: 'parent-flat',
                        data: flatJson
                    },
                    child: {
                        name: 'child-yml',
                        data: yaml
                    }
                };
                chai.request(app.server)
                    .post(url)
                    .set('content-type', 'application/json')
                    .send(payload)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        console.log("diff return:", res.body.data[0]);
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
        child: {
            name: 'child-yaml',
            data: yaml
        }
    });

    diffTest({
        parent: {
            name: 'parent-yaml',
            data: yaml
        },
        child: {
            name: 'child-flat',
            data: flatJson
        }
    });

    diffTest({
        parent: {
            name: 'parent-yaml',
            data: yaml
        },
        child: {
            name: 'child-yaml',
            data: yaml
        }
    });

    diffTest({
        parent: {
            name: 'parent-flat',
            data: flatJson
        },
        child: {
            name: 'child-flat',
            data: flatJson
        }
    });

});
