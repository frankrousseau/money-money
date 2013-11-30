(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  module.exports = {
    initialize: function() {
      var Router;
      Router = require('router');
      this.router = new Router();
      Backbone.history.start();
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };
  
});
window.require.register("initialize", function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    require('lib/app_helpers');
    return app.initialize();
  });
  
});
window.require.register("lib/app_helpers", function(exports, require, module) {
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
});
window.require.register("lib/base_view", function(exports, require, module) {
  var BaseView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      _ref = BaseView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseView.prototype.template = function() {};

    BaseView.prototype.initialize = function() {};

    BaseView.prototype.getRenderData = function() {
      var _ref1;
      return {
        model: (_ref1 = this.model) != null ? _ref1.toJSON() : void 0
      };
    };

    BaseView.prototype.render = function() {
      this.beforeRender();
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    BaseView.prototype.beforeRender = function() {};

    BaseView.prototype.afterRender = function() {};

    BaseView.prototype.destroy = function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    };

    return BaseView;

  })(Backbone.View);
  
});
window.require.register("lib/request", function(exports, require, module) {
  exports.request = function(type, url, data, callback) {
    return $.ajax({
      type: type,
      url: url,
      data: data != null ? JSON.stringify(data) : null,
      contentType: "application/json",
      dataType: "json",
      success: function(data) {
        if (callback != null) {
          return callback(null, data);
        }
      },
      error: function(data) {
        if ((data != null) && (data.msg != null) && (callback != null)) {
          return callback(new Error(data.msg));
        } else if (callback != null) {
          return callback(new Error("Server error occured"));
        }
      }
    });
  };

  exports.get = function(url, callback) {
    return exports.request("GET", url, null, callback);
  };

  exports.post = function(url, data, callback) {
    return exports.request("POST", url, data, callback);
  };

  exports.put = function(url, data, callback) {
    return exports.request("PUT", url, data, callback);
  };

  exports.del = function(url, callback) {
    return exports.request("DELETE", url, null, callback);
  };
  
});
window.require.register("lib/view_collection", function(exports, require, module) {
  var BaseView, ViewCollection, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = ViewCollection = (function(_super) {
    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.removeItem = __bind(this.removeItem, this);
      this.addItem = __bind(this.addItem, this);
      _ref = ViewCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ViewCollection.prototype.itemview = null;

    ViewCollection.prototype.views = {};

    ViewCollection.prototype.template = function() {
      return '';
    };

    ViewCollection.prototype.itemViewOptions = function() {};

    ViewCollection.prototype.collectionEl = null;

    ViewCollection.prototype.onChange = function() {
      return this.$el.toggleClass('empty', _.size(this.views) === 0);
    };

    ViewCollection.prototype.appendView = function(view) {
      return this.$collectionEl.append(view.el);
    };

    ViewCollection.prototype.initialize = function() {
      var collectionEl;
      ViewCollection.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.addItem);
      this.listenTo(this.collection, "remove", this.removeItem);
      if (this.collectionEl == null) {
        return collectionEl = el;
      }
    };

    ViewCollection.prototype.render = function() {
      var id, view, _ref1;
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.$el.detach();
      }
      return ViewCollection.__super__.render.apply(this, arguments);
    };

    ViewCollection.prototype.afterRender = function() {
      var id, view, _ref1;
      this.$collectionEl = $(this.collectionEl);
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        this.appendView(view.$el);
      }
      this.onReset(this.collection);
      return this.onChange(this.views);
    };

    ViewCollection.prototype.remove = function() {
      this.onReset([]);
      return ViewCollection.__super__.remove.apply(this, arguments);
    };

    ViewCollection.prototype.onReset = function(newcollection) {
      var id, view, _ref1;
      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.remove();
      }
      return newcollection.forEach(this.addItem);
    };

    ViewCollection.prototype.addItem = function(model) {
      var options, view;
      options = _.extend({}, {
        model: model
      }, this.itemViewOptions(model));
      view = new this.itemview(options);
      this.views[model.cid] = view.render();
      this.appendView(view);
      return this.onChange(this.views);
    };

    ViewCollection.prototype.removeItem = function(model) {
      this.views[model.cid].remove();
      delete this.views[model.cid];
      return this.onChange(this.views);
    };

    return ViewCollection;

  })(BaseView);
  
});
window.require.register("router", function(exports, require, module) {
  var AppView, Router, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppView = require('views/app_view');

  module.exports = Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'main'
    };

    Router.prototype.main = function() {
      var mainView;
      mainView = new AppView();
      return mainView.render();
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("views/app_view", function(exports, require, module) {
  var AppView, BaseView, average, averageDay, getDayGraphData, getDayGraphLabels, printDonut, printGraph, request, sum, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  request = require('../lib/request');

  sum = function(data) {
    var amount, i, total, _i, _len;
    i = 0;
    total = 0;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      amount = data[_i];
      total += amount.value;
      i++;
    }
    return total;
  };

  average = function(data) {
    var amount, i, total, _i, _len;
    i = 0;
    total = 0;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      amount = data[_i];
      total += amount.value;
      i++;
    }
    return (total / i).toFixed(2);
  };

  averageDay = function(data) {
    var amount, day, i, total;
    i = 0;
    total = 0;
    for (day in data) {
      amount = data[day];
      total += amount;
      i++;
    }
    return (total / i).toFixed(2);
  };

  getDayGraphLabels = function(data) {
    var amount, day, result;
    result = [];
    for (day in data) {
      amount = data[day];
      result.push("d");
    }
    return result;
  };

  getDayGraphData = function(data) {
    var amount, day, result;
    result = [];
    for (day in data) {
      amount = data[day];
      result.push(amount);
    }
    return result;
  };

  module.exports = AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      _ref = AppView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.template = require('./templates/home');

    AppView.prototype.afterRender = function() {
      request.get('gain/month', function(err, data) {
        var income;
        $("#average-gain-month").html(average(data));
        income = sum(data);
        return request.get('loss/month', function(err, data) {
          var expense;
          $("#average-loss-month").html(average(data));
          expense = sum(data);
          console.log(income);
          console.log(expense);
          return printDonut(income, -1 * expense);
        });
      });
      request.get('gain/day', function(err, data) {
        return $("#average-gain-day").html(averageDay(data));
      });
      return request.get('tasks', function(err, data2) {
        var amount, day, totalTasks;
        $("#average-task-day").html(averageDay(data2));
        totalTasks = 0;
        for (day in data2) {
          amount = data2[day];
          totalTasks += amount;
        }
        data2 = _.map(data2, function(num) {
          return num * 10;
        });
        return request.get('loss/day', function(err, data) {
          var totalLoss;
          $("#average-loss-day").html(averageDay(data));
          data = _.map(data, function(num) {
            return num * -1;
          });
          printGraph("graph-loss", data, data2);
          totalLoss = 0;
          for (day in data) {
            amount = data[day];
            totalLoss += amount;
          }
          return $("#average-task-cost").html((totalLoss / totalTasks).toFixed(2));
        });
      });
    };

    return AppView;

  })(BaseView);

  printDonut = function(income, expense) {
    var chart, doughnutData, myDoughnut;
    doughnutData = [
      {
        value: income,
        color: "#F7464A"
      }, {
        value: expense,
        color: "#46BFBD"
      }, {
        value: 200866,
        color: "#FDB45C"
      }
    ];
    chart = new Chart(document.getElementById("donut").getContext("2d"));
    myDoughnut = chart.Doughnut(doughnutData);
    return $("#compare-select").on('change', function(event) {
      var data;
      data = doughnutData;
      data[2].value = $("#compare-select").val();
      console.log($("#compare-select").val());
      return myDoughnut = chart.Doughnut(data);
    });
  };

  printGraph = function(graphId, data1, data2) {
    var chartLoss, ctx, graphData, graphData2, graphLabels, points;
    ctx = $("#" + graphId).get(0).getContext("2d");
    graphData = getDayGraphData(data1);
    graphLabels = getDayGraphLabels(data1);
    graphData2 = getDayGraphData(data2);
    points = {
      labels: graphLabels,
      datasets: [
        {
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "#46BFBD",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          data: graphData
        }, {
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          data: graphLabels
        }, {
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(187,151,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          data: graphData2
        }
      ]
    };
    return chartLoss = new Chart(ctx).Line(points);
  };
  
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><div class="step-intro"><div class="prez"><img src="logo.png"/><h1>Finance Dataviz</h1><h2>Understand your money stream to get more income</h2><p>Facts: Do you know that you gain 20344 times less money than Michael\nSchumarrer ?</p><p>Facts: Do you know that you could pay 42 Kazhak doctors with your \nincome ?</p></div><div class="value clearfix"><h3 id="average-gain-month">loading...</h3><h2>Income by month</h2></div><div class="value clearfix"><h3 id="average-gain-day">loading...</h3><h2>Income by day</h2></div><div class="value clearfix"><h3 id="average-loss-month">loading...</h3><h2>Expense by month</h2></div><div class="value clearfix"><h3 id="average-loss-day">loading...</h3><h2>Expense by day</h2></div><div class="clearfix"></div></div><div class="step-productivity"><h2>Does productivity costs you money?</h2><canvas id="graph-loss" width="1200" height="400"></canvas><p>Each task you achieve costs you:&nbsp;<span id="average-task-cost"></span>&nbsp;euros</p></div><div class="step-compare"><h2>How do you compare to others?</h2><select id="compare-select"><option value="14626866">Schumacher annual income</option><option value="5000">Mark Zuckerberg last home</option><option value="200">Monthly salary of a doctor in Pakistan</option></select><canvas id="donut" width="600" height="400"></canvas></div></div>');
  }
  return buf.join("");
  };
});
