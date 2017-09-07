(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'js-sdk-range'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('js-sdk-range'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jsSdkRange);
    global.index = mod.exports;
  }
})(this, function (exports, _jsSdkRange) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.week = exports.isLastWeek = exports.isFirstWeek = exports.month = exports.endOfMonth = exports.beginOfMonth = undefined;
  exports.chunk = chunk;
  exports.monthImpl = monthImpl;
  exports.weekImpl = weekImpl;


  // list
  function chunk(ls, n) {
    var l = ls;
    var res = [];
    while (l.length > 0) {
      res.push(l.splice(0, n));
    }return res;
  }

  var beginOfMonth = exports.beginOfMonth = function beginOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  };
  var endOfMonth = exports.endOfMonth = function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  };

  function monthImpl(d, f) {
    var bm = beginOfMonth(d);
    var em = endOfMonth(d);

    var lastDayOfWeek = em.getDay();

    var headDays = new Array(bm.getDay()).fill(0);
    var tailDays = new Array(6 - lastDayOfWeek).fill(0);

    return chunk(headDays.concat((0, _jsSdkRange.rangeImpl)(1, em.getDate() + 1, 1, f)).concat(tailDays), 7);
  }

  var month = exports.month = function month(d) {
    return monthImpl(d, function (x) {
      return x;
    });
  };

  var isFirstWeek = exports.isFirstWeek = function isFirstWeek(d) {
    return d.getDate() - d.getDay() < 7;
  };
  var isLastWeek = exports.isLastWeek = function isLastWeek(d) {
    return d.getDate() + (6 - d.getDay()) > endOfMonth(d).getDate();
  };

  function weekImpl(d, f) {
    var weekday = d.getDay();
    var day = d.getDate();

    if (isFirstWeek(d)) {
      return new Array(weekday).fill(0).concat((0, _jsSdkRange.rangeImpl)(Math.max(1, day - weekday), day + (7 - weekday), 1, f));
    }

    if (isLastWeek(d)) {
      var eom = endOfMonth(d);
      return (0, _jsSdkRange.rangeImpl)(day - weekday, Math.min(eom.getDate() + 1, day + (7 - weekday)), 1, f).concat(new Array(6 - eom.getDay()).fill(0));
    }

    return (0, _jsSdkRange.rangeImpl)(day - weekday, day + (7 - weekday), 1, f);
  }

  var week = exports.week = function week(date) {
    return weekImpl(date, function (x) {
      return x;
    });
  };
});
