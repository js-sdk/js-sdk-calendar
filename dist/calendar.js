(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'js-sdk-range', 'js-sdk-list'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('js-sdk-range'), require('js-sdk-list'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jsSdkRange, global.jsSdkList);
    global.index = mod.exports;
  }
})(this, function (exports, _jsSdkRange, _jsSdkList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.weekC = exports.week = exports.monthC = exports.month = exports.applyWithYearAndMonth = exports.lastWeekOfPreviousMonth = exports.lastWeekOfMonth = exports.firstWeekOfNextMonth = exports.firstWeekOfMonth = exports.endOfPreviousMonth = exports.beginOfNextMonth = exports.endOfDay = exports.beginOfDay = exports.endOfMonth = exports.beginOfMonth = exports.rangeInMonth = exports.monthRange = exports.isLastWeek = exports.isFirstWeek = undefined;
  exports.monthImpl = monthImpl;
  exports.monthCImpl = monthCImpl;
  exports.weekImpl = weekImpl;
  exports.weekCImpl = weekCImpl;
  var isFirstWeek = exports.isFirstWeek = function isFirstWeek(d) {
    return d.getDate() - d.getDay() < 7;
  };

  var isLastWeek = exports.isLastWeek = function isLastWeek(d) {
    return d.getDate() + (6 - d.getDay()) > endOfMonth(d).getDate();
  };

  var monthRange = exports.monthRange = function monthRange(s, e, f) {
    return (0, _jsSdkRange.rangeImpl)(s, e + 1, 1, f);
  };

  var rangeInMonth = exports.rangeInMonth = function rangeInMonth(d, s, e, f) {
    var em = endOfMonth(d);
    return (0, _jsSdkRange.rangeImpl)(d.getDate(), Math.min(e + 1, em.getDate()), 1, f);
  };

  var beginOfMonth = exports.beginOfMonth = function beginOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  };

  var endOfMonth = exports.endOfMonth = function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  };

  var beginOfDay = exports.beginOfDay = function beginOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  var endOfDay = exports.endOfDay = function endOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 59);
  };

  var beginOfNextMonth = exports.beginOfNextMonth = function beginOfNextMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 1);
  };

  var endOfPreviousMonth = exports.endOfPreviousMonth = function endOfPreviousMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 0);
  };

  var firstWeekOfMonth = exports.firstWeekOfMonth = function firstWeekOfMonth(d, f) {
    return (0, _jsSdkRange.rangeImpl)(1, 8 - d.getDay(), 1, f);
  };

  var firstWeekOfNextMonth = exports.firstWeekOfNextMonth = function firstWeekOfNextMonth(d, f) {
    return firstWeekOfMonth(beginOfNextMonth(d), f);
  };

  var lastWeekOfMonth = exports.lastWeekOfMonth = function lastWeekOfMonth(d, f) {
    return monthRange(d.getDate() - d.getDay(), d.getDate(), f);
  };

  var lastWeekOfPreviousMonth = exports.lastWeekOfPreviousMonth = function lastWeekOfPreviousMonth(d, f) {
    return lastWeekOfMonth(endOfPreviousMonth(d), f);
  };

  function monthImpl(d, f) {
    var bm = beginOfMonth(d);
    var em = endOfMonth(d);
    return (0, _jsSdkList.chunk)((0, _jsSdkList.reserve)(bm.getDay()).concat(monthRange(1, em.getDate(), f)).concat((0, _jsSdkList.reserve)(6 - em.getDay())), 7);
  }

  var applyWithYearAndMonth = exports.applyWithYearAndMonth = function applyWithYearAndMonth(f, date) {
    var y = date.getFullYear();
    var m = date.getMonth();
    return function (d) {
      return f(y, m, d);
    };
  };

  function monthCImpl(d, f) {
    var em = endOfMonth(d);
    var ldpm = endOfPreviousMonth(d);
    var fdnm = beginOfNextMonth(d);
    return (0, _jsSdkList.chunk)(lastWeekOfMonth(ldpm, applyWithYearAndMonth(f, ldpm)).concat(monthRange(1, em.getDate(), applyWithYearAndMonth(f, d))).concat(firstWeekOfMonth(fdnm, applyWithYearAndMonth(f, fdnm))), 7);
  }

  var month = exports.month = function month(d) {
    return monthImpl(d, function (x) {
      return x;
    });
  };

  var monthC = exports.monthC = function monthC(d) {
    return monthCImpl(d, function (y, m, d) {
      return [y, m, d];
    });
  };

  function weekImpl(d, f) {
    var weekday = d.getDay();
    var day = d.getDate();

    if (isFirstWeek(d)) {
      var bom = beginOfMonth(d);
      return (0, _jsSdkList.reserve)(bom.getDay()).concat(firstWeekOfMonth(bom, f));
    }

    if (isLastWeek(d)) {
      var eom = endOfMonth(d);
      return lastWeekOfMonth(eom, f).concat((0, _jsSdkList.reserve)(6 - eom.getDay()));
    }

    return (0, _jsSdkRange.rangeImpl)(day - weekday, day + (7 - weekday), 1, f);
  }

  function weekCImpl(d, f) {
    var weekday = d.getDay();
    var day = d.getDate();
    var eom = endOfMonth(d);

    var proxyCurrentDate = applyWithYearAndMonth(f, d);

    if (isFirstWeek(d) && day - weekday != 1) {
      var eopm = endOfPreviousMonth(d);
      var proxyDate = applyWithYearAndMonth(f, eopm);
      return lastWeekOfMonth(eom, proxyDate).concat(firstWeekOfMonth(d, proxyCurrentDate));
    }

    if (isLastWeek(d) && eom.getDay() != 6) {
      var bom = beginOfNextMonth(d);
      var _proxyDate = applyWithYearAndMonth(f, bom);
      return lastWeekOfMonth(d, proxyCurrentDate).concat(firstWeekOfMonth(bom, _proxyDate));
    }

    return (0, _jsSdkRange.rangeImpl)(day - weekday, day + (7 - weekday), 1, proxyCurrentDate);
  }

  var week = exports.week = function week(date) {
    return weekImpl(date, function (x) {
      return x;
    });
  };

  var weekC = exports.weekC = function weekC(d) {
    return weekCImpl(d, function (y, m, d) {
      return [y, m, d];
    });
  };
});
