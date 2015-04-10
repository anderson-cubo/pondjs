_shared = function(request) {
  return {
    ajax: function() {

    },
    cookies: function() {
      var _cookies =  {
        set: function(name, value, days, path) {
          
        },
        get: function(name) {

        },
        erase: function(name) {
          _cookies.set(name, '', -1);
        }
      }
      return _cookies;
    },
    _fake_url: "/",
    url: function() {
      return this._fake_url;
    },
    setFakeUrl: function(_url) {
      this._fake_url = _url;
    },
    onRequest: function(fn) {

    },
    pushState: function(link) {
      console.log("Pushing State: ", link);
    },
    setTitle: function(title) {
      $('title').html(title);
    },
    setAsSkeleton: function(_html) {
      $("body").html(_html);
    },
    querySelector: function(qs) {
      var _qs = $(qs);
      return {
        html: function(html) {
          _qs.html(html);
        }
      }
    }
    getHTML: function() {
      return $.html();
    },
    loadSkeleton: function() {

    },
    loadPage: function() {

    }
  }
}
