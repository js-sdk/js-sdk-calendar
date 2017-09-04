(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _index = require('../../src/index.js');

var C = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var month = document.querySelector("#calendar .month");
var weekdays = document.querySelector("#calendar .weekdays");
var days = document.querySelector("#calendar .days");

var nodeCache;
var weekNodeCache;

var currentDate = new Date();
var monthCache = C.month(currentDate);

function createNode(c, f) {
  return function (d) {
    var node = document.createElement('div');
    node.className = c;
    node.innerHTML = f(d);
    return node;
  };
}

var dayName = function dayName(d) {
  return d > 0 ? d : "";
};

function denyEvent(e) {
  if (!e.target.getAttribute('data-day')) {
    e.stopPropagation();
    return true;
  }
  return false;
}

function dateFromCalendarDate(date, day) {
  return new Date(date.getFullYear(), date.getMonth(), day);
}

function log(tag) {
  return function (event) {
    if (denyEvent(event)) {
      return;
    }
    var day = event.target.getAttribute('data-day');
    var date = dateFromCalendarDate(currentDate, day);
    console.log(tag, date);
  };
}

function setupEventListeners(n) {
  n.addEventListener('click', log("Clicked:"));
  n.addEventListener('mouseover', log("Mouse over:"));
  n.addEventListener('mouseout', log("Mouse out:"));
}

function updateCalendar(cache, date, calendar) {
  month.innerHTML = monthNames[date.getMonth()];
  cache.forEach(function (w, i) {
    var week = calendar[i];
    nodeCache[i].forEach(function (n, d) {
      var day = week && d < week.length ? week[d] : 0;
      day > 0 && n.setAttribute('data-day', day);
      n.innerHTML = dayName(day);
    });
  });
}

function selectMonth(f) {
  return function () {
    var x = currentDate.getMonth();
    currentDate = new Date(currentDate.getFullYear(), f(x), 1);
    monthCache = C.month(currentDate);
    updateCalendar(weekNodeCache, currentDate, monthCache);
  };
}

var nextMonth = function nextMonth(x) {
  return x + 1 > 11 ? 0 : x + 1;
};
var previousMonth = function previousMonth(x) {
  return x - 1 < 0 ? 11 : x - 1;
};

var weekdayNode = createNode('weekday', function (d) {
  return d;
});
var weekNode = createNode('week', function (d) {
  return "";
});
var dayNode = createNode('day', dayName);

weekNodeCache = new Array(6).fill().map(weekNode);
nodeCache = weekNodeCache.map(function (_) {
  return new Array(7).fill().map(dayNode);
});

var weekdayCache = weekDaysNames.map(weekdayNode);

weekdayCache.forEach(function (n) {
  return weekdays.appendChild(n);
});
weekNodeCache.forEach(function (w, i) {
  nodeCache[i].forEach(function (n) {
    setupEventListeners(n);
    w.appendChild(n);
  });
  days.append(w);
});

document.querySelector("#next").addEventListener('click', selectMonth(nextMonth));
document.querySelector("#previous").addEventListener('click', selectMonth(previousMonth));

updateCalendar(weekNodeCache, currentDate, monthCache);

},{"../../src/index.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var charLowerRange = exports.charLowerRange = ['a'.charCodeAt(0), 'z'.charCodeAt(0)];
var charUpperRange = exports.charUpperRange = ['A'.charCodeAt(0), 'Z'.charCodeAt(0)];
var charNumberRange = exports.charNumberRange = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

var between = exports.between = function between(value, lower, higher) {
  return value >= lower && value <= higher;
};

var rangeIn = exports.rangeIn = function rangeIn(start, end, range) {
  return between(start, range[0], range[1]) && between(end, range[0], range[1]);
};

var rangeImpl = exports.rangeImpl = function rangeImpl(start, end, step, f) {
  var length = end - start;
  var elements = step > 1 ? length - (step == 1 ? 0 : Math.round(length / step)) : Math.round(length / step);
  var ls = new Array(elements);
  for (var i = 0; i < length && i <= elements; i++) {
    ls[i] = f(i * step + start);
  }
  return ls;
};

var rangeChar = exports.rangeChar = function rangeChar(start, end) {
  var x = start.charCodeAt(0);
  var y = end.charCodeAt(0);
  var ok = rangeIn(x, y, charLowerRange) || rangeIn(x, y, charUpperRange) || rangeIn(x, y, charNumberRange);
  return ok ? rangeImpl(x, y + 1, 1, String.fromCharCode) : [];
};

var rangeStep = exports.rangeStep = function rangeStep(start, end, step) {
  return rangeImpl(start, end, step, function (x) {
    return x;
  });
};

var range = exports.range = function range(start, end) {
  return rangeImpl(start, end, 1, function (x) {
    return x;
  });
};

var rangeInclStep = exports.rangeInclStep = function rangeInclStep(start, end, step) {
  return rangeStep(start, end + 1, step);
};

var rangeIncl = exports.rangeIncl = function rangeIncl(start, end) {
  return range(start, end + 1, 1);
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLastWeek = exports.isFirstWeek = exports.endOfMonth = exports.beginOfMonth = undefined;
exports.chunk = chunk;
exports.month = month;
exports.week = week;

var _jsSdkRange = require('js-sdk-range');

// datetime
var beginOfMonth = exports.beginOfMonth = function beginOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
};
var endOfMonth = exports.endOfMonth = function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

// list
function chunk(ls, n) {
  var l = ls;
  var res = [];
  while (l.length > 0) {
    res.push(l.splice(0, n));
  }return res;
}

function month(a) {
  var bm = beginOfMonth(a);
  var em = endOfMonth(a);

  var lastDayOfWeek = em.getDay();

  var headDays = new Array(bm.getDay()).fill(0);
  var tailDays = new Array(lastDayOfWeek < 6 ? 6 - lastDayOfWeek : 0).fill(0);

  return chunk(headDays.concat((0, _jsSdkRange.rangeIncl)(1, em.getDate())).concat(tailDays), 7);
}

var isFirstWeek = exports.isFirstWeek = function isFirstWeek(d) {
  return d.getDate() - d.getDay() < 7;
};
var isLastWeek = exports.isLastWeek = function isLastWeek(d) {
  return d.getDate() + (6 - d.getDay()) > endOfMonth(d).getDate();
};

function week(d) {
  var weekday = d.getDay();
  var day = d.getDate();

  if (isFirstWeek(d)) {
    return new Array(weekday).fill(0).concat((0, _jsSdkRange.range)(Math.max(1, day - weekday), day + (7 - weekday)));
  }

  if (isLastWeek(d)) {
    var eom = endOfMonth(d);
    return (0, _jsSdkRange.range)(day - weekday, Math.min(eom.getDate() + 1, day + (7 - weekday))).concat(new Array(6 - eom.getDay()).fill(0));
  }

  return (0, _jsSdkRange.range)(day - weekday, day + (7 - weekday));
}

},{"js-sdk-range":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtc2RrLXJhbmdlL2xpYi9yYW5nZS5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0lBQVksQzs7OztBQUVaLElBQUksYUFBYSxDQUNmLFNBRGUsRUFDSixVQURJLEVBQ1EsT0FEUixFQUNpQixPQURqQixFQUMwQixLQUQxQixFQUNpQyxNQURqQyxFQUVmLE1BRmUsRUFFUCxRQUZPLEVBRUcsV0FGSCxFQUVnQixTQUZoQixFQUUyQixVQUYzQixFQUV1QyxVQUZ2QyxDQUFqQjtBQUlBLElBQUksZ0JBQWdCLENBQ2xCLEtBRGtCLEVBQ1gsS0FEVyxFQUNKLEtBREksRUFDRyxLQURILEVBQ1UsS0FEVixFQUNpQixLQURqQixFQUN3QixLQUR4QixDQUFwQjs7QUFJQSxJQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLGtCQUF2QixDQUFaO0FBQ0EsSUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixxQkFBdkIsQ0FBZjtBQUNBLElBQUksT0FBTyxTQUFTLGFBQVQsQ0FBdUIsaUJBQXZCLENBQVg7O0FBRUEsSUFBSSxTQUFKO0FBQ0EsSUFBSSxhQUFKOztBQUVBLElBQUksY0FBYyxJQUFJLElBQUosRUFBbEI7QUFDQSxJQUFJLGFBQWEsRUFBRSxLQUFGLENBQVEsV0FBUixDQUFqQjs7QUFFQSxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsRUFBMEI7QUFDeEIsU0FBTyxhQUFLO0FBQ1YsUUFBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEVBQUUsQ0FBRixDQUFqQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBTEQ7QUFNRDs7QUFFRCxJQUFJLFVBQVUsU0FBVixPQUFV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LCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQyBmcm9tICcuLi8uLi9zcmMvaW5kZXguanMnO1xuXG52YXIgbW9udGhOYW1lcyA9IFtcbiAgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXG5dO1xudmFyIHdlZWtEYXlzTmFtZXMgPSBbXG4gICdTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXG5dO1xuXG52YXIgbW9udGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbGVuZGFyIC5tb250aFwiKTtcbnZhciB3ZWVrZGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FsZW5kYXIgLndlZWtkYXlzXCIpO1xudmFyIGRheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbGVuZGFyIC5kYXlzXCIpO1xuXG52YXIgbm9kZUNhY2hlO1xudmFyIHdlZWtOb2RlQ2FjaGU7XG5cbnZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG52YXIgbW9udGhDYWNoZSA9IEMubW9udGgoY3VycmVudERhdGUpO1xuXG5mdW5jdGlvbiBjcmVhdGVOb2RlKGMsIGYpIHtcbiAgcmV0dXJuIGQgPT4ge1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9kZS5jbGFzc05hbWUgPSBjO1xuICAgIG5vZGUuaW5uZXJIVE1MID0gZihkKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcbn1cblxudmFyIGRheU5hbWUgPSBkID0+IGQgPiAwID8gZCA6IFwiXCI7XG5cbmZ1bmN0aW9uIGRlbnlFdmVudChlKSB7XG4gIGlmICghZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWRheScpKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRhdGVGcm9tQ2FsZW5kYXJEYXRlKGRhdGUsIGRheSkge1xuICByZXR1cm4gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgICAgICAgZGF0ZS5nZXRNb250aCgpLFxuICAgICAgICAgICAgICAgICAgZGF5KTtcbn1cblxuZnVuY3Rpb24gbG9nKHRhZykge1xuICByZXR1cm4gZXZlbnQgPT4ge1xuICAgIGlmIChkZW55RXZlbnQoZXZlbnQpKSB7IHJldHVybjsgfVxuICAgIGNvbnN0IGRheSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF5Jyk7XG4gICAgY29uc3QgZGF0ZSA9IGRhdGVGcm9tQ2FsZW5kYXJEYXRlKGN1cnJlbnREYXRlLCBkYXkpO1xuICAgIGNvbnNvbGUubG9nKHRhZywgZGF0ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRMaXN0ZW5lcnMobikge1xuICBuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nKFwiQ2xpY2tlZDpcIikpO1xuICBuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGxvZyhcIk1vdXNlIG92ZXI6XCIpKTtcbiAgbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGxvZyhcIk1vdXNlIG91dDpcIikpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDYWxlbmRhcihjYWNoZSwgZGF0ZSwgY2FsZW5kYXIpIHtcbiAgbW9udGguaW5uZXJIVE1MID0gbW9udGhOYW1lc1tkYXRlLmdldE1vbnRoKCldO1xuICBjYWNoZS5mb3JFYWNoKCh3LCBpKSA9PiB7XG4gICAgdmFyIHdlZWsgPSBjYWxlbmRhcltpXTtcbiAgICBub2RlQ2FjaGVbaV0uZm9yRWFjaCgobiwgZCkgPT4ge1xuICAgICAgdmFyIGRheSA9IHdlZWsgJiYgZCA8IHdlZWsubGVuZ3RoID8gd2Vla1tkXSA6IDA7XG4gICAgICAoZGF5ID4gMCkgJiYgbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGF5JywgZGF5KTtcbiAgICAgIG4uaW5uZXJIVE1MID0gZGF5TmFtZShkYXkpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0TW9udGgoZikge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHZhciB4ID0gY3VycmVudERhdGUuZ2V0TW9udGgoKTtcbiAgICBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCksIGYoeCksIDEpO1xuICAgIG1vbnRoQ2FjaGUgPSBDLm1vbnRoKGN1cnJlbnREYXRlKTtcbiAgICB1cGRhdGVDYWxlbmRhcih3ZWVrTm9kZUNhY2hlLCBjdXJyZW50RGF0ZSwgbW9udGhDYWNoZSk7XG4gIH07XG59XG5cbmNvbnN0IG5leHRNb250aCA9IHggPT4geCArIDEgPiAxMSA/IDAgOiB4ICsgMTtcbmNvbnN0IHByZXZpb3VzTW9udGggPSB4ID0+IHggLSAxIDwgMCA/IDExIDogeCAtIDE7XG5cbnZhciB3ZWVrZGF5Tm9kZSA9IGNyZWF0ZU5vZGUoJ3dlZWtkYXknLCBkID0+IGQpO1xudmFyIHdlZWtOb2RlID0gY3JlYXRlTm9kZSgnd2VlaycsIGQgPT4gXCJcIik7XG52YXIgZGF5Tm9kZSA9IGNyZWF0ZU5vZGUoJ2RheScsIGRheU5hbWUpO1xuXG53ZWVrTm9kZUNhY2hlID0gKG5ldyBBcnJheSg2KSkuZmlsbCgpLm1hcCh3ZWVrTm9kZSk7XG5ub2RlQ2FjaGUgPSB3ZWVrTm9kZUNhY2hlLm1hcChfID0+IChuZXcgQXJyYXkoNykpLmZpbGwoKS5tYXAoZGF5Tm9kZSkpO1xuXG52YXIgd2Vla2RheUNhY2hlID0gd2Vla0RheXNOYW1lcy5tYXAod2Vla2RheU5vZGUpO1xuXG53ZWVrZGF5Q2FjaGUuZm9yRWFjaChuID0+IHdlZWtkYXlzLmFwcGVuZENoaWxkKG4pKTtcbndlZWtOb2RlQ2FjaGUuZm9yRWFjaCgodywgaSkgPT4ge1xuICBub2RlQ2FjaGVbaV0uZm9yRWFjaCgobikgPT4ge1xuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMobik7XG4gICAgdy5hcHBlbmRDaGlsZChuKTtcbiAgfSk7XG4gIGRheXMuYXBwZW5kKHcpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdE1vbnRoKG5leHRNb250aCkpO1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmV2aW91c1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdE1vbnRoKHByZXZpb3VzTW9udGgpKTtcblxudXBkYXRlQ2FsZW5kYXIod2Vla05vZGVDYWNoZSwgY3VycmVudERhdGUsIG1vbnRoQ2FjaGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGNoYXJMb3dlclJhbmdlID0gZXhwb3J0cy5jaGFyTG93ZXJSYW5nZSA9IFsnYScuY2hhckNvZGVBdCgwKSwgJ3onLmNoYXJDb2RlQXQoMCldO1xudmFyIGNoYXJVcHBlclJhbmdlID0gZXhwb3J0cy5jaGFyVXBwZXJSYW5nZSA9IFsnQScuY2hhckNvZGVBdCgwKSwgJ1onLmNoYXJDb2RlQXQoMCldO1xudmFyIGNoYXJOdW1iZXJSYW5nZSA9IGV4cG9ydHMuY2hhck51bWJlclJhbmdlID0gWycwJy5jaGFyQ29kZUF0KDApLCAnOScuY2hhckNvZGVBdCgwKV07XG5cbnZhciBiZXR3ZWVuID0gZXhwb3J0cy5iZXR3ZWVuID0gZnVuY3Rpb24gYmV0d2Vlbih2YWx1ZSwgbG93ZXIsIGhpZ2hlcikge1xuICByZXR1cm4gdmFsdWUgPj0gbG93ZXIgJiYgdmFsdWUgPD0gaGlnaGVyO1xufTtcblxudmFyIHJhbmdlSW4gPSBleHBvcnRzLnJhbmdlSW4gPSBmdW5jdGlvbiByYW5nZUluKHN0YXJ0LCBlbmQsIHJhbmdlKSB7XG4gIHJldHVybiBiZXR3ZWVuKHN0YXJ0LCByYW5nZVswXSwgcmFuZ2VbMV0pICYmIGJldHdlZW4oZW5kLCByYW5nZVswXSwgcmFuZ2VbMV0pO1xufTtcblxudmFyIHJhbmdlSW1wbCA9IGV4cG9ydHMucmFuZ2VJbXBsID0gZnVuY3Rpb24gcmFuZ2VJbXBsKHN0YXJ0LCBlbmQsIHN0ZXAsIGYpIHtcbiAgdmFyIGxlbmd0aCA9IGVuZCAtIHN0YXJ0O1xuICB2YXIgZWxlbWVudHMgPSBzdGVwID4gMSA/IGxlbmd0aCAtIChzdGVwID09IDEgPyAwIDogTWF0aC5yb3VuZChsZW5ndGggLyBzdGVwKSkgOiBNYXRoLnJvdW5kKGxlbmd0aCAvIHN0ZXApO1xuICB2YXIgbHMgPSBuZXcgQXJyYXkoZWxlbWVudHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aCAmJiBpIDw9IGVsZW1lbnRzOyBpKyspIHtcbiAgICBsc1tpXSA9IGYoaSAqIHN0ZXAgKyBzdGFydCk7XG4gIH1cbiAgcmV0dXJuIGxzO1xufTtcblxudmFyIHJhbmdlQ2hhciA9IGV4cG9ydHMucmFuZ2VDaGFyID0gZnVuY3Rpb24gcmFuZ2VDaGFyKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHggPSBzdGFydC5jaGFyQ29kZUF0KDApO1xuICB2YXIgeSA9IGVuZC5jaGFyQ29kZUF0KDApO1xuICB2YXIgb2sgPSByYW5nZUluKHgsIHksIGNoYXJMb3dlclJhbmdlKSB8fCByYW5nZUluKHgsIHksIGNoYXJVcHBlclJhbmdlKSB8fCByYW5nZUluKHgsIHksIGNoYXJOdW1iZXJSYW5nZSk7XG4gIHJldHVybiBvayA/IHJhbmdlSW1wbCh4LCB5ICsgMSwgMSwgU3RyaW5nLmZyb21DaGFyQ29kZSkgOiBbXTtcbn07XG5cbnZhciByYW5nZVN0ZXAgPSBleHBvcnRzLnJhbmdlU3RlcCA9IGZ1bmN0aW9uIHJhbmdlU3RlcChzdGFydCwgZW5kLCBzdGVwKSB7XG4gIHJldHVybiByYW5nZUltcGwoc3RhcnQsIGVuZCwgc3RlcCwgZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geDtcbiAgfSk7XG59O1xuXG52YXIgcmFuZ2UgPSBleHBvcnRzLnJhbmdlID0gZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gcmFuZ2VJbXBsKHN0YXJ0LCBlbmQsIDEsIGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH0pO1xufTtcblxudmFyIHJhbmdlSW5jbFN0ZXAgPSBleHBvcnRzLnJhbmdlSW5jbFN0ZXAgPSBmdW5jdGlvbiByYW5nZUluY2xTdGVwKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgcmV0dXJuIHJhbmdlU3RlcChzdGFydCwgZW5kICsgMSwgc3RlcCk7XG59O1xuXG52YXIgcmFuZ2VJbmNsID0gZXhwb3J0cy5yYW5nZUluY2wgPSBmdW5jdGlvbiByYW5nZUluY2woc3RhcnQsIGVuZCkge1xuICByZXR1cm4gcmFuZ2Uoc3RhcnQsIGVuZCArIDEsIDEpO1xufTtcbiIsImltcG9ydCB7IHJhbmdlLCByYW5nZUluY2wgfSBmcm9tICdqcy1zZGstcmFuZ2UnO1xuXG4vLyBkYXRldGltZVxuZXhwb3J0IGNvbnN0IGJlZ2luT2ZNb250aCA9IGQgPT4gbmV3IERhdGUoZC5nZXRGdWxsWWVhcigpLCBkLmdldE1vbnRoKCksIDEpO1xuZXhwb3J0IGNvbnN0IGVuZE9mTW9udGggPSBkID0+IG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpICsgMSwgMCk7XG5cbi8vIGxpc3RcbmV4cG9ydCBmdW5jdGlvbiBjaHVuayhscywgbikge1xuICBsZXQgbCA9IGxzO1xuICBsZXQgcmVzID0gW107XG4gIHdoaWxlIChsLmxlbmd0aCA+IDApXG4gICAgcmVzLnB1c2gobC5zcGxpY2UoMCwgbikpO1xuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW9udGgoYSkge1xuICBjb25zdCBibSA9IGJlZ2luT2ZNb250aChhKTtcbiAgY29uc3QgZW0gPSBlbmRPZk1vbnRoKGEpO1xuXG4gIGNvbnN0IGxhc3REYXlPZldlZWsgPSBlbS5nZXREYXkoKTtcblxuICBjb25zdCBoZWFkRGF5cyA9IChuZXcgQXJyYXkoYm0uZ2V0RGF5KCkpKS5maWxsKDApO1xuICBjb25zdCB0YWlsRGF5cyA9IChuZXcgQXJyYXkobGFzdERheU9mV2VlayA8IDYgPyA2IC0gbGFzdERheU9mV2VlayA6IDApKS5maWxsKDApO1xuXG4gIHJldHVybiBjaHVuayhoZWFkRGF5cy5jb25jYXQoXG4gICAgcmFuZ2VJbmNsKDEsIGVtLmdldERhdGUoKSlcbiAgKS5jb25jYXQodGFpbERheXMpLCA3KTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RXZWVrID0gZCA9PiAoZC5nZXREYXRlKCkgLSBkLmdldERheSgpKSA8IDc7XG5leHBvcnQgY29uc3QgaXNMYXN0V2VlayA9IGQgPT4gKGQuZ2V0RGF0ZSgpICsgKDYgLSBkLmdldERheSgpKSkgPiBlbmRPZk1vbnRoKGQpLmdldERhdGUoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHdlZWsoZCkge1xuICBjb25zdCB3ZWVrZGF5ID0gZC5nZXREYXkoKTtcbiAgY29uc3QgZGF5ID0gZC5nZXREYXRlKCk7XG5cbiAgaWYgKGlzRmlyc3RXZWVrKGQpKSB7XG4gICAgcmV0dXJuIChuZXcgQXJyYXkod2Vla2RheSkpLmZpbGwoMCkuY29uY2F0KFxuICAgICAgcmFuZ2UoXG4gICAgICAgIE1hdGgubWF4KDEsIGRheSAtIHdlZWtkYXkpLFxuICAgICAgICBkYXkgKyAoNyAtIHdlZWtkYXkpXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc0xhc3RXZWVrKGQpKSB7XG4gICAgY29uc3QgZW9tID0gZW5kT2ZNb250aChkKTtcbiAgICByZXR1cm4gcmFuZ2UoXG4gICAgICBkYXkgLSB3ZWVrZGF5LFxuICAgICAgTWF0aC5taW4oZW9tLmdldERhdGUoKSArIDEsIGRheSArICg3IC0gd2Vla2RheSkpXG4gICAgKS5jb25jYXQoXG4gICAgICAobmV3IEFycmF5KDYgLSBlb20uZ2V0RGF5KCkpKS5maWxsKDApXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZShkYXkgLSB3ZWVrZGF5LCBkYXkgKyAoNyAtIHdlZWtkYXkpKTtcbn1cbiJdfQ==
