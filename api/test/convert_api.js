const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(chaiHttp);
const app = require('../app');

function logAndThrow(err) {
    console.log(err);
    throw err;
}

describe('Yipee Convert API Tests:', function() {
    this.timeout(60000);

    after(function(done) {
        if (app.server) {
            app.server.close();
        }
        done();
    });

    const convertTest = function(dltype) {
        describe('#convertTest ' + dltype.type, function() {
            it('should convert the posted file', function(done) {
                let url = '/convert/' + dltype.type;
                let req = chai.request(app.server)
                    .post(url)
                    .set('content-type', 'application/json')
                    .send(dltype.payload)
                    .then(res => {
                        expect(res).to.have.status(dltype.expectStatus);
                        if (dltype.expectStatus < 300) {
                            expect(res.text).to.not.be.empty;
                            let data = JSON.parse(res.text);
                            expect(data).to.have.all.keys(
                                'success', 'total', 'data');
                            expect(data.total).to.equal(1);
                            expect(data.data[0]).to.have.all.keys(
                                'name', 'version', dltype.type + "File");
                        }
                        done();
                    })
                    .catch(err => {
                        logAndThrow(err);
                        done(err);
                    });
            });
        });
    }

    const flatYipee = {
        container: [
            {
                "id": "56e37323-3e8b-4049-a41c-14517cfe62f8",
                "name": "one",
                "type": "container"
            }
        ],
        "app-info": [
            {
                "id": "b62052ed-6c89-44e3-a3e9-ba24cc38172c",
                "name": "flatYipee",
                "type": "app-info"
            }
        ],
        image: [
            {
                "container": "56e37323-3e8b-4049-a41c-14517cfe62f8",
                "id": "f050ba15-b311-4467-bed9-db02fcf2ee90",
                "type": "image",
                "value": "one"
            }
        ]
    };

    const convertTypes = [
        {
            type: 'booger',
            payload: flatYipee,
            expectStatus: 404
        },
        {
            type: 'kubernetes',
            payload: flatYipee,
            expectStatus: 200
        },
        {
            type: 'helm',
            payload: flatYipee,
            expectStatus: 200
        }
    ];

    convertTypes.forEach(function(val) {
        convertTest(val);
    });
});
