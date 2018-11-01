var apiHost = process.env.API_HOST;
var target = 'http://' + apiHost;
var proxyConfig = [{
  context: '/api',
  target: target,
  secure: false,
  pathRewrite: {
    "^/api": "",
  }
},{
  context: '/docker',
  target: 'https://index.docker.io',
  secure: true,
  pathRewrite: {
    "^/docker": "",
  },
  changeOrigin: true
}];
module.exports = proxyConfig;
