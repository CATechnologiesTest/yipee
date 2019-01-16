var apiHost = process.env.API_HOST;
var target = 'http://' + apiHost;
var wsTarget = 'ws://' + apiHost;
var proxyConfig = [{
  context: '/api',
  target: target,
  secure: false,
  pathRewrite: {
    "^/api": "",
  }
},
{
  context: '/primus',
  target: wsTarget,
  secure: false,
  ws: true
}];
module.exports = proxyConfig;
