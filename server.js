var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var opts = require("nomnom").parse();

var cheerio = require('cheerio');
var Pond = require('./pond');
var fs = require('fs');
var vm = require('vm');
//CREATE SANDBOX
var _rawIndex = fs.readFileSync(opts[0]).toString();
var $ = cheerio.load(_rawIndex);
var setInCtx = function(file, Pond) {
  vm.runInNewContext(fs.readFileSync(__dirname+file), {Pond: Pond}, file);
}
var runInNewCtx = function(script, ctx, filename) {
  vm.runInNewContext(script, ctx, filename);
}
var setAllActions = function() {
  var _actions = $('[data-pond="true"]');
  var _l = _actions.length;
  var i = 0;
  for(i; i < _l; i++) {
    setInCtx(_actions[i].attribs.src, Pond);
  }
}
setAllActions();
app.post("/public/*", function(req, res, next) {
  req.method = "GET";
  next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use('/client', express.static('require_client'));
app.use('/actions', express.static('actions'));
app.use('/components', express.static('components'));
app.all("/pond.js", function(req, res) {
  res.sendFile(__dirname+"/pond.js");
});
app.all("/pond.shared.js", function(req, res) {
  res.sendFile(__dirname+"/pond.shared.client.js");
});
app.all("*", function(req, res) {
  var url = "/index.html";
  if(req.path != "/") {
    url = req.path;
  }
  console.log("this is method", req.method);
  Pond.shared.setFakeUrl(url);
  var _res = Pond.routes(url).pushState(req.method);
  if(_res != false) {
    res.send(Pond.shared.getHTML());
  } else {
    res.status(500);
    res.send("500 - Internal Error");
  }
});
app.listen(3000, '0.0.0.0');
