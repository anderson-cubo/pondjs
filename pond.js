var _settings = {
  componentsFolder: "./components/"
};
var Application = function(modules) {
  this._modules = modules;
  this._methods = {};
  this._actions = {};
  this._routes = {};
  this._components = {};
  this._routesSettings = {};
  this.debbug = function(args) {
    if(_settings.debbug)
      console.log.apply(console, arguments);
  }
  this.set = function(name, val) {
    _settings[name] = val;
  }
  this.action = function(name, action) {
    var that = this;
    if(!name) {
      return false;
    }
    if(is.object(action)) {
      that._actions[name] = action;
    } else {
      if(!is.object(that._actions[name]))
        return false;
      that.debbug("Returning obj in action");
      return {
        call: function(options) {
          that.debbug("Calling an Action");
          var _action = that._actions[name];
          that.debbug("this Action: ", _action);
          if(is.fn(_action[action])) {
            that.debbug("Is A FN");
            return _action[action](options);
          } else {
            return false;
          }
        },
        purge: function() {
          delete that._actions[name];
          return true;
        }
      };
    }
  }
  this.method = function(name, method) {
    var that = this;
    that.debbug("getting Method ", name, method);
    if(!name) {
      return false;
    }
    that.debbug("Has name");
    if(is.object(method)) {
      that._methods[name] = method;
      that.debbug("IS OBJECT");
    } else {
      if(!is.object(that._methods[name]))
        return false;
      that.debbug("returning OBJ");
      return {
        call: function(options) {
          var _method = that._methods[name];
          if(is.fn(_method[method.toLowerCase()])) {
            that.action(name, "*").call();
            that.debbug("Action with the right method called", method);
            return _method[method.toLowerCase()](options);
          } else if(is.fn(_method["*"])) {
            that.debbug("Method Called: ", name, "with Options: ", options);
            that.action(name, "*").call();
            return _method["*"](options);
          } else {
            return false;
          }
        },
        purge: function() {
          delete that._method[name];
          return true;
        }
      };
    }
  }
  this.components = function(components) {
    var that = this;
    var folder = _settings.componentsFolder;
    if(is.array(components)) {
      components.forEach(function(el, index) {
        that._components[el] = folder+el+".html";
      });
    } else {
      if(that._components[components]) {
        return {
          render: function(options, callback) {
            if(callback)
              nunjucks.render(that._components[components], options, callback);
            else
              return nunjucks.render(that._components[components], options);
          },
          set: function(where, options) {
            var _rend = this.render(options);
            _shared.querySelector("[data-template='"+where+"']").html(_rend);
          },
          watch: function() {

          }
        };
      } else {
        return false;
      }
    }
  }
  /*this.binding = function(route, bind) {
    var that = this;
    if(is.object(bind) && that.routes(route)) {

    } else {
      return {};
    }
  }*/
  this.routes = function(route, methodName) {
    var that = this;
    if(route && methodName) {
      that._routes[route] = {
        methodName: methodName
      }
    } else {
      return {
        routes : function() {
          if(_settings.kind != 'SERVER') {
            var url = URI(_shared.url());
            if(url.path() == "/" || url.path() == "/index.html") {
              that.debbug("p /");
              if(that._routesSettings['default']) {
                that.debbug("Default Being Called");
                _shared.pushState(that._routesSettings['default']);
              }
            } else {
              if(is.object(that._routes[url.path()])) {
                _shared.pushState(url.path());
              } else {
                if(that._routesSettings['error']) {
                  _shared.pushState(that._routesSettings['error']);
                }
              }
            }
          }
          var fnState =  function(event) {
            //event.state
            var url = URI(location.href);
            that.debbug("calling pop State: ", url.path());
            if(is.object(that._routes[url.path()])) {

              that.routes(url.path()).go();
            }
          };
          _shared.onRequest(fnState);
        },
        setDefault: function() {
          if(is.object(that._routes[route]))
            that._routesSettings['default'] = route;
          else
            return false;
        },
        setError: function(route) {
          if(is.object(that._routes[route]))
            that._routesSettings['error'] = route;
          else
            return false;
        },
        pushState: function(method, options){
          if(is.object(that._routes[route])) {
            _shared.pushState(route);
            this.go(method, options);
          } else {
            return false;
          }
        },
        go: function(method, options) {
          if(is.object(that._routes[route])) {
            var methodName = that._routes[route].methodName;
            if(!method)
              var method = "GET";
            if(!options)
              var options = {};
            that.debbug("opening route: ", route, method, options);
            if(that.method(methodName, method).call(options) == false) {
              alert('Something Went Wrong!');
            }
          } else {
            return false;
          }
        }
      };
    }
  }
  this.formSerialize = function(form) {
    var ser = $(form).serializeArray();
    var _obj = {};
    var i = 0;
    var _l = ser.length;
    for(i; i < _l; i++) {
      _obj[ser[i].name] = ser[i].value;
    }
    return _obj;
  }
  this.start = function() {
    var that = this;
    that.debbug(_settings.kind);
    if(_settings.kind == 'SERVER')
      //_shared = that._shared_server;
    else {
      //THIS BIND SHOULD BE DIFFERENT FROM SERVER ACTION
      $(document).on("click", "[href]", function(e) {
        var link = $(this).attr("href");
        if(link != "#") {
          e.preventDefault();
          that.routes(link).pushState('GET');
          return false;
        }
      });
      $(document).on('submit', 'form', function(e) {
        //console.log($(this).attr());
        var action = $(this).attr("action");
        var method = $(this).attr("method");
        that.routes(action).pushState(method, that.formSerialize(this));
        e.preventDefault();
        return false;
      });
    }
    //_shared.bindings();
    that._modules.forEach(function(data) {
      if(is.fn(that[data]) || is.object(that[data])) {
        //that.debbug("calling:", that[data]()[data]);
        if(is.fn(that[data]()[data]))
          that[data]()[data]();
      }
    });
  }
}
if(typeof(module) != 'undefined') {
  _settings.kind = 'SERVER';
  var is  = require('is');
  var URI = require('URIjs');
  var opts = require("nomnom").parse();
  var nunjucks = require('nunjucks');
  var cheerio = require('cheerio');
  var fs = require('fs');
  var _rawIndex = fs.readFileSync(opts[0]).toString();
  var $ = cheerio.load(_rawIndex);
  module.exports = Application;
} else {
  _settings.kind = 'CLIENT';
}
