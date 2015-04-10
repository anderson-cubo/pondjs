//its like we call window as object
_shared = function() {
  return {
    ajax: function() {
      return  qwest;
    },
    cookies: function() {
      var _cookies =  {
        set: function(name, value, days, path) {
          if(!path) var path  = '/';
          if (days) {
              var date = new Date();
              date.setTime(date.getTime()+(days*24*60*60*1000));
              var expires = "; expires="+date.toGMTString();
          }
          else var expires = "";
          document.cookie = name+"="+value+expires+"; path="+path;
        },
        get: function(name) {
          var nameEQ = name + "=";
          var ca = document.cookie.split(';');
          for(var i=0;i < ca.length;i++) {
              var c = ca[i];
              while (c.charAt(0)==' ') c = c.substring(1,c.length);
              if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
          }
          return null;
        },
        erase: function(name) {
          _cookies.set(name, '', -1);
        }
      }
      return _cookies;
    },
    url: function() {
      return location.href;
    },
    setTitle: function(title) {
      document.querySelector("title").innerHTML = title;
    },
    setAsSkeleton: function(_html) {
      document.querySelector("body").innerHTML = _html;
    },
    onRequest: function(fn) {
      window.addEventListener('popstate', fn, false);
    },
    pushState: function(link) {
      history.pushState({}, "", link);
    },
    querySelector: function(qs) {
      var _qs = document.querySelector(qs);
      return {
        html: function(html) {
          _qs.innerHTML = html;
        }
      }
    },
    bindings: function() {
      $(document).on("submit", "form", function(e) {
        //CALL THIS - BINDINGS
        //GET METHOD
        //GET ACTION
        var _route = $(this).attr('action');
        var _r = Pound.routes(_route)
      });
    }
  }
}
_shared = _shared();
