!function(e) {
  var c = window.webpackJsonp;
  window.webpackJsonp = function t(o, d, r) {
      for (var s, i, p, u = 0, f = []; u < o.length; u++)
          i = o[u],
          a[i] && f.push(a[i][0]),
          a[i] = 0;
      for (s in d)
          Object.prototype.hasOwnProperty.call(d, s) && (e[s] = d[s]);
      for (c && c(o, d, r); f.length; )
          f.shift()();
      if (r)
          for (u = 0; u < r.length; u++)
              p = n(n.s = r[u]);
      return p
  }
  ;
  var t = {}
    , a = {
      29: 0
  };
  function n(c) {
      if (t[c])
          return t[c].exports;
      var a = t[c] = {
          i: c,
          l: !1,
          exports: {}
      };
      return e[c].call(a.exports, a, a.exports, n),
      a.l = !0,
      a.exports
  }
  n.m = e,
  n.c = t,
  n.d = function(e, c, t) {
      n.o(e, c) || Object.defineProperty(e, c, {
          configurable: !1,
          enumerable: !0,
          get: t
      })
  }
  ,
  n.n = function(e) {
      var c = e && e.__esModule ? function c() {
          return e.default
      }
      : function c() {
          return e
      }
      ;
      return n.d(c, "a", c),
      c
  }
  ,
  n.o = function(e, c) {
      return Object.prototype.hasOwnProperty.call(e, c)
  }
  ,
  n.p = "https://sta-op.douyucdn.cn/front-publish/live-master/js/room/",
  n.oe = function(e) {
      throw console.error(e),
      e
  }
  ,
  n(n.s = 0)

  module();
}({
  0: function(e, c, t) {
      e.exports = {}
  }
});

function module () {
  webpackJsonp([], {
  f853: function(e, t) {
    !function(t, n) {
        "use strict";
        "object" === typeof e && "object" === typeof e.exports ? e.exports = t.document ? n(t, !0) : function(e) {
            if (!e.document)
                throw new Error("Geetest requires a window with a document");
            return n(e)
        }
        : n(t)
    }("undefined" !== typeof window ? window : this, function(e, t) {
        "use strict";
        if ("undefined" === typeof e)
            throw new Error("Geetest requires browser environment");
        var n = e.document
          , r = e.Math
          , i = n.getElementsByTagName("head")[0];
        function o(e) {
            this._obj = e
        }
        function a(e) {
            var t = this;
            new o(e)._each(function(e, n) {
                t[e] = n
            })
        }
        o.prototype = {
            _each: function e(t) {
                var n = this._obj;
                for (var r in n)
                    n.hasOwnProperty(r) && t(r, n[r]);
                return this
            }
        },
        a.prototype = {
            api_server: "api.geetest.com",
            protocol: "chrome-extension://bnamlohllkckieagjpienbbpakemanhh/",
            type_path: "/gettype.php",
            fallback_config: {
                slide: {
                    static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
                    type: "slide",
                    slide: "/static/js/geetest.0.0.0.js"
                },
                fullpage: {
                    static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
                    type: "fullpage",
                    fullpage: "/static/js/fullpage.0.0.0.js"
                }
            },
            _get_fallback_config: function e() {
                return l(this.type) ? this.fallback_config[this.type] : this.new_captcha ? this.fallback_config.fullpage : this.fallback_config.slide
            },
            _extend: function e(t) {
                var n = this;
                new o(t)._each(function(e, t) {
                    n[e] = t
                })
            }
        };
        var l = function e(t) {
            return "string" === typeof t
        }
          , s = function e(t) {
            return "function" === typeof t
        }
          , u = {}
          , c = {}
          , p = function e(t, n, r, i) {
            n = function e(t) {
                return t.replace(/^https?:\/\/|\/$/g, "")
            }(n);
            var a = function e(t) {
                return 0 !== (t = t.replace(/\/+/g, "/")).indexOf("/") && (t = "/" + t),
                t
            }(r) + function e(t) {
                if (!t)
                    return "";
                var n = "?";
                return new o(t)._each(function(e, t) {
                    (l(t) || function e(t) {
                        return "number" === typeof t
                    }(t) || function e(t) {
                        return "boolean" === typeof t
                    }(t)) && (n = n + encodeURIComponent(e) + "=" + encodeURIComponent(t) + "&")
                }),
                "?" === n && (n = ""),
                n.replace(/&$/, "")
            }(i);
            return n && (a = t + n + a),
            a
        }
          , f = function e(t, r, o, a, l) {
            !function e(s) {
                !function e(t, r) {
                    var o = n.createElement("script");
                    o.charset = "UTF-8",
                    o.async = !0,
                    o.onerror = function() {
                        r(!0)
                    }
                    ;
                    var a = !1;
                    o.onload = o.onreadystatechange = function() {
                        a || o.readyState && "loaded" !== o.readyState && "complete" !== o.readyState || (a = !0,
                        setTimeout(function() {
                            r(!1)
                        }, 0))
                    }
                    ,
                    o.src = t,
                    i.appendChild(o)
                }(p(t, r[s], o, a), function(t) {
                    t ? s >= r.length - 1 ? l(!0) : e(s + 1) : l(!1)
                })
            }(0)
        }
          , d = function t(n, i, o, a) {
            if (function e(t) {
                return "object" === typeof t && null !== t
            }(o.getLib))
                return o._extend(o.getLib),
                void a(o);
            if (o.offline)
                a(o._get_fallback_config());
            else {
                var l = "geetest_" + function e() {
                    return parseInt(1e4 * r.random()) + (new Date).valueOf()
                }();
                e[l] = function(t) {
                    "success" === t.status ? a(t.data) : t.status ? a(o._get_fallback_config()) : a(t),
                    e[l] = void 0;
                    try {
                        delete e[l]
                    } catch (e) {}
                }
                ,
                f(o.protocol, n, i, {
                    gt: o.gt,
                    callback: l
                }, function(e) {
                    e && a(o._get_fallback_config())
                })
            }
        }
          , h = function e(t, n) {
            var r = {
                networkError: "\u7f51\u7edc\u9519\u8bef"
            };
            if ("function" !== typeof n.onError)
                throw new Error(r[t]);
            n.onError(r[t])
        };
        (function t() {
            return !!e.Geetest
        }
        )() && (c.slide = "loaded");
        var b = function t(n, r) {
            var i = new a(n);
            n.https ? i.protocol = "https://" : n.protocol || (i.protocol = 'https:' + "//"),
            d([i.api_server || i.apiserver], i.type_path, i, function(t) {
                var n = t.type
                  , o = function n() {
                    i._extend(t),
                    r(new e.Geetest(i))
                };
                u[n] = u[n] || [];
                var a = c[n] || "init";
                "init" === a ? (c[n] = "loading",
                u[n].push(o),
                f(i.protocol, t.static_servers || t.domains, t[n] || t.path, null, function(e) {
                    if (e)
                        c[n] = "fail",
                        h("networkError", i);
                    else {
                        c[n] = "loaded";
                        for (var t = u[n], r = 0, o = t.length; r < o; r += 1) {
                            var a = t[r];
                            s(a) && a()
                        }
                        u[n] = []
                    }
                })) : "loaded" === a ? o() : "fail" === a ? h("networkError", i) : "loading" === a && u[n].push(o)
            })
        };
        return e.initGeetest = b,
        b
    })
},
  d104: function(e, t, n) {
    "use strict";
    t.a = {
        geeInitParams: {
            isNeedCheck: !0,
            data: {}
        },
        xhrParams: {
            url: "",
            data: {}
        },
        geeOptions: {
            id: "",
            lang: "zh-cn",
            product: "custom",
            width: "100%",
            area: "body",
            next_width: "260px",
            bg_color: "transparent"
        },
        success: function e() {},
        error: function e() {},
        close: function e() {},
        otherFunctions: {
            init: function e() {},
            catch: function e() {},
            refresh: function e() {},
            destroy: function e() {}
        }
    }
  },

  "3b12": function(e, t, n) {
    "use strict";
    t.a = {
        deepMerge: function e(t, n) {
            return Object.keys(n).forEach(function(r) {
                t[r] = t[r] && "[object Object]" === t[r].toString() ? e(t[r], n[r]) : t[r] = n[r]
            }),
            t
        }
    }
  },
  "68b9": function(e, t, n) {
    "use strict";
    var r = n("f853")
      , i = (n.n(r),
    Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    }
    );
    t.a = function e(t, n) {
        var r = this;
        !function o(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }(this, e),
        this.build = function() {
            if (!r.options.geeOptions)
                return new Promise(function(e) {
                    e(null)
                }
                );
            var e = i({}, r.options.geeOptions, r.geeParams);
            return new Promise(function(t) {
                window.initGeetest(e, function(n) {
                    t(n),
                    n.appendTo("#" + e.id),
                    n.onSuccess(function() {
                        var e = n.getValidate();
                        r.options.success(e)
                    }),
                    n.onError(function() {
                        r.options.error()
                    }),
                    n.onClose(function() {
                        r.options.close()
                    })
                })
            }
            )
        }
        ,
        this.options = t,
        this.geeParams = n
    }
},
  "617d": function(e, t, n) {
    "use strict";
    var a = n("68b9")
      , l = n("d104")
      , s = n("3b12");
    var u = function() {
        function e(t) {
            var n = this;
            !function a(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, e),
            this.init = function() {
                var e = n.options.geeInitParams;
                e.isNeedCheck ? n.getVerifyType() : n.geeBuild(e.data)
            }
            ,
            this.options = s.a.deepMerge(l.a, t)
        }
        return e.prototype.geeBuild = function e(t) {
            var n = this
              , r = this.options.otherFunctions;
            new a.a(this.options,t).build().then(function(e) {
                e ? (r.init(),
                n.refresh = function() {
                    e.reset(),
                    r.refresh()
                }
                ,
                n.getGeeResult = function() {
                    return e.getValidate()
                }
                ,
                n.destroy = function() {
                    e.destroy(),
                    r.destroy()
                }
                ) : r.catch()
            }).catch(r.catch)
        }
        ,
        e
    }();
    t.a = function(e) {
        var t = new u(e);
        return t.init(),
        t
    }
  },
  "0947": function(e, t, n) {
    "use strict";
    var r = n("617d");
    t.a = r.a
  },
}, ['0947']);

const validate_str = '{"success":1,"challenge":"5bafb3566c7bcc30bbd9e5089f643f16","gt":"2f5e33b3c37769a84647b2024ac48b56"}';
const geeFn = Object(webpackJsonp([], null, ['0947']).a)({
  geeInitParams: {
    isNeedCheck: !1,
    data: JSON.parse(validate_str)
  },
  geeOptions: {
    id: "TreasureGee-captcha"
  },
  success: function e(r) {
    console.log('r:', r);
  },
  error: function e() {
      console.log('error'. arguments);
  },
});
}