var apiHost = process.env.API_HOST;
var target = 'http://' + apiHost;
var proxyConfig = [{
  context: '/api',
  target: target,
  secure: false,
  pathRewrite: {
    "^/api": "",
  }
}];
module.exports = proxyConfig;
