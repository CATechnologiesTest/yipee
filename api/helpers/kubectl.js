const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');

function kubeCmd(cmd) {
    return new Promise((resolve, reject) => {
        let fullcmd = './kubectl ' + cmd;
        exec(fullcmd, (err, stdout, stderr) => {
            resolve({err: err, stdout: stdout, stderr: stderr});
        });
    });
}

function tmpName() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(8, (err, buf) => {
            if (err) {
                reject(err);
            } else {
                resolve(os.tmpdir() + '/' + buf.toString('hex'));
            }
        });
    });
}

function mkTemp(indata) {
    return new Promise((resolve, reject) => {
        tmpName()
            .then(fname => {
                fs.writeFile(fname, indata, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(fname);
                    }
                });
            })
            .catch(err => {
                reject(err);
            });
    });
}

function createNamespace(nsname) {
    return new Promise((resolve, reject) => {
        kubeCmd(`create namespace ${nsname}`)
            .then(res => {
                if (res.err) {
                    reject(new Error(res.stderr));
                } else {
                    resolve(true);
                }
            });
    });
}
module.exports.createNamespace = createNamespace;

function doApply(nsname, yamldata) {
    let tmpname = null;
    return new Promise((resolve, reject) => {
        mkTemp(yamldata)
            .then(tmpfile => {
                tmpname = tmpfile;
                let cmd = '';
                if (nsname) {
                    cmd = `--namespace=${nsname}`;
                }
                return kubeCmd(`${cmd} apply -f ${tmpfile}`);
            })
            .then(res => {
                if (res.err) {
                    reject(new Error(res.stderr));
                } else {
                    resolve(true);
                }
            })
            .catch(err => {
                reject(err);
            })
            .then(() => { // XXX: .finally() not in our node version.  Sigh.
                // best effort to remove -- ignore errors
                fs.unlink(tmpname, (err) => {});
            });
    });
}
module.exports.doApply = doApply;
