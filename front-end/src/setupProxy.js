const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api1', {
        target: "http://localhost:4000",
        pathRewrite: {'^/api1': ''},
        changeOrigin: true
    }));
};