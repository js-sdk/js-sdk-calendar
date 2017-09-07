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
  return d ? d : "";
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
      day && n.setAttribute('data-day', day);
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
exports.week = exports.isLastWeek = exports.isFirstWeek = exports.month = exports.endOfMonth = exports.beginOfMonth = undefined;
exports.chunk = chunk;
exports.monthImpl = monthImpl;
exports.weekImpl = weekImpl;

var _jsSdkRange = require('js-sdk-range');

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

  var headDays = new Array(bm.getDay()).fill(null);
  var tailDays = new Array(6 - lastDayOfWeek).fill(null);

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
    return new Array(weekday).fill(null).concat((0, _jsSdkRange.rangeImpl)(Math.max(1, day - weekday), day + (7 - weekday), 1, f));
  }

  if (isLastWeek(d)) {
    var eom = endOfMonth(d);
    return (0, _jsSdkRange.rangeImpl)(day - weekday, Math.min(eom.getDate() + 1, day + (7 - weekday)), 1, f).concat(new Array(6 - eom.getDay()).fill(null));
  }

  return (0, _jsSdkRange.rangeImpl)(day - weekday, day + (7 - weekday), 1, f);
}

var week = exports.week = function week(date) {
  return weekImpl(date, function (x) {
    return x;
  });
};

},{"js-sdk-range":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtc2RrLXJhbmdlL2xpYi9yYW5nZS5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0lBQVksQzs7OztBQUVaLElBQUksYUFBYSxDQUNmLFNBRGUsRUFDSixVQURJLEVBQ1EsT0FEUixFQUNpQixPQURqQixFQUMwQixLQUQxQixFQUNpQyxNQURqQyxFQUVmLE1BRmUsRUFFUCxRQUZPLEVBRUcsV0FGSCxFQUVnQixTQUZoQixFQUUyQixVQUYzQixFQUV1QyxVQUZ2QyxDQUFqQjtBQUlBLElBQUksZ0JBQWdCLENBQ2xCLEtBRGtCLEVBQ1gsS0FEVyxFQUNKLEtBREksRUFDRyxLQURILEVBQ1UsS0FEVixFQUNpQixLQURqQixFQUN3QixLQUR4QixDQUFwQjs7QUFJQSxJQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLGtCQUF2QixDQUFaO0FBQ0EsSUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixxQkFBdkIsQ0FBZjtBQUNBLElBQUksT0FBTyxTQUFTLGFBQVQsQ0FBdUIsaUJBQXZCLENBQVg7O0FBRUEsSUFBSSxTQUFKO0FBQ0EsSUFBSSxhQUFKOztBQUVBLElBQUksY0FBYyxJQUFJLElBQUosRUFBbEI7QUFDQSxJQUFJLGFBQWEsRUFBRSxLQUFGLENBQVEsV0FBUixDQUFqQjs7QUFFQSxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsRUFBMEI7QUFDeEIsU0FBTyxhQUFLO0FBQ1YsUUFBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEVBQUUsQ0FBRixDQUFqQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBTEQ7QUFNRDs7QUFFRCxJQUFJLFVBQVUsU0FBVixPQUFV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QUFVLElBQUksSUFBSSxNQUFKLEVBQWQsQ0FBRCxDQUE4QixJQUE5QixDQUFtQyxJQUFuQyxDQU5LLENBQVA7QUFRRDs7QUFFRCxTQUFPLDJCQUNMLE1BQU0sT0FERCxFQUVMLE9BQU8sSUFBSSxPQUFYLENBRkssRUFHTCxDQUhLLEVBR0YsQ0FIRSxDQUFQO0FBS0Q7O0FBRU0sSUFBTSxzQkFBTyxTQUFQLElBQU87QUFBQSxTQUFRLFNBQVMsSUFBVCxFQUFlO0FBQUEsV0FBSyxDQUFMO0FBQUEsR0FBZixDQUFSO0FBQUEsQ0FBYiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBDIGZyb20gJy4uLy4uL3NyYy9pbmRleC5qcyc7XG5cbnZhciBtb250aE5hbWVzID0gW1xuICAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsXG4gICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlcidcbl07XG52YXIgd2Vla0RheXNOYW1lcyA9IFtcbiAgJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCdcbl07XG5cbnZhciBtb250aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FsZW5kYXIgLm1vbnRoXCIpO1xudmFyIHdlZWtkYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYWxlbmRhciAud2Vla2RheXNcIik7XG52YXIgZGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FsZW5kYXIgLmRheXNcIik7XG5cbnZhciBub2RlQ2FjaGU7XG52YXIgd2Vla05vZGVDYWNoZTtcblxudmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbnZhciBtb250aENhY2hlID0gQy5tb250aChjdXJyZW50RGF0ZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vZGUoYywgZikge1xuICByZXR1cm4gZCA9PiB7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBub2RlLmNsYXNzTmFtZSA9IGM7XG4gICAgbm9kZS5pbm5lckhUTUwgPSBmKGQpO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xufVxuXG52YXIgZGF5TmFtZSA9IGQgPT4gZCA/IGQgOiBcIlwiO1xuXG5mdW5jdGlvbiBkZW55RXZlbnQoZSkge1xuICBpZiAoIWUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1kYXknKSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBkYXRlRnJvbUNhbGVuZGFyRGF0ZShkYXRlLCBkYXkpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgICAgICAgIGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICAgICAgICAgIGRheSk7XG59XG5cbmZ1bmN0aW9uIGxvZyh0YWcpIHtcbiAgcmV0dXJuIGV2ZW50ID0+IHtcbiAgICBpZiAoZGVueUV2ZW50KGV2ZW50KSkgeyByZXR1cm47IH1cbiAgICBjb25zdCBkYXkgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWRheScpO1xuICAgIGNvbnN0IGRhdGUgPSBkYXRlRnJvbUNhbGVuZGFyRGF0ZShjdXJyZW50RGF0ZSwgZGF5KTtcbiAgICBjb25zb2xlLmxvZyh0YWcsIGRhdGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50TGlzdGVuZXJzKG4pIHtcbiAgbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvZyhcIkNsaWNrZWQ6XCIpKTtcbiAgbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBsb2coXCJNb3VzZSBvdmVyOlwiKSk7XG4gIG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBsb2coXCJNb3VzZSBvdXQ6XCIpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2FsZW5kYXIoY2FjaGUsIGRhdGUsIGNhbGVuZGFyKSB7XG4gIG1vbnRoLmlubmVySFRNTCA9IG1vbnRoTmFtZXNbZGF0ZS5nZXRNb250aCgpXTtcbiAgY2FjaGUuZm9yRWFjaCgodywgaSkgPT4ge1xuICAgIHZhciB3ZWVrID0gY2FsZW5kYXJbaV07XG4gICAgbm9kZUNhY2hlW2ldLmZvckVhY2goKG4sIGQpID0+IHtcbiAgICAgIHZhciBkYXkgPSB3ZWVrICYmIGQgPCB3ZWVrLmxlbmd0aCA/IHdlZWtbZF0gOiAwO1xuICAgICAgZGF5ICYmIG4uc2V0QXR0cmlidXRlKCdkYXRhLWRheScsIGRheSk7XG4gICAgICBuLmlubmVySFRNTCA9IGRheU5hbWUoZGF5KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdE1vbnRoKGYpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB2YXIgeCA9IGN1cnJlbnREYXRlLmdldE1vbnRoKCk7XG4gICAgY3VycmVudERhdGUgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpLCBmKHgpLCAxKTtcbiAgICBtb250aENhY2hlID0gQy5tb250aChjdXJyZW50RGF0ZSk7XG4gICAgdXBkYXRlQ2FsZW5kYXIod2Vla05vZGVDYWNoZSwgY3VycmVudERhdGUsIG1vbnRoQ2FjaGUpO1xuICB9O1xufVxuXG5jb25zdCBuZXh0TW9udGggPSB4ID0+IHggKyAxID4gMTEgPyAwIDogeCArIDE7XG5jb25zdCBwcmV2aW91c01vbnRoID0geCA9PiB4IC0gMSA8IDAgPyAxMSA6IHggLSAxO1xuXG52YXIgd2Vla2RheU5vZGUgPSBjcmVhdGVOb2RlKCd3ZWVrZGF5JywgZCA9PiBkKTtcbnZhciB3ZWVrTm9kZSA9IGNyZWF0ZU5vZGUoJ3dlZWsnLCBkID0+IFwiXCIpO1xudmFyIGRheU5vZGUgPSBjcmVhdGVOb2RlKCdkYXknLCBkYXlOYW1lKTtcblxud2Vla05vZGVDYWNoZSA9IChuZXcgQXJyYXkoNikpLmZpbGwoKS5tYXAod2Vla05vZGUpO1xubm9kZUNhY2hlID0gd2Vla05vZGVDYWNoZS5tYXAoXyA9PiAobmV3IEFycmF5KDcpKS5maWxsKCkubWFwKGRheU5vZGUpKTtcblxudmFyIHdlZWtkYXlDYWNoZSA9IHdlZWtEYXlzTmFtZXMubWFwKHdlZWtkYXlOb2RlKTtcblxud2Vla2RheUNhY2hlLmZvckVhY2gobiA9PiB3ZWVrZGF5cy5hcHBlbmRDaGlsZChuKSk7XG53ZWVrTm9kZUNhY2hlLmZvckVhY2goKHcsIGkpID0+IHtcbiAgbm9kZUNhY2hlW2ldLmZvckVhY2goKG4pID0+IHtcbiAgICBzZXR1cEV2ZW50TGlzdGVuZXJzKG4pO1xuICAgIHcuYXBwZW5kQ2hpbGQobik7XG4gIH0pO1xuICBkYXlzLmFwcGVuZCh3KTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25leHRcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxlY3RNb250aChuZXh0TW9udGgpKTtcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJldmlvdXNcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxlY3RNb250aChwcmV2aW91c01vbnRoKSk7XG5cbnVwZGF0ZUNhbGVuZGFyKHdlZWtOb2RlQ2FjaGUsIGN1cnJlbnREYXRlLCBtb250aENhY2hlKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBjaGFyTG93ZXJSYW5nZSA9IGV4cG9ydHMuY2hhckxvd2VyUmFuZ2UgPSBbJ2EnLmNoYXJDb2RlQXQoMCksICd6Jy5jaGFyQ29kZUF0KDApXTtcbnZhciBjaGFyVXBwZXJSYW5nZSA9IGV4cG9ydHMuY2hhclVwcGVyUmFuZ2UgPSBbJ0EnLmNoYXJDb2RlQXQoMCksICdaJy5jaGFyQ29kZUF0KDApXTtcbnZhciBjaGFyTnVtYmVyUmFuZ2UgPSBleHBvcnRzLmNoYXJOdW1iZXJSYW5nZSA9IFsnMCcuY2hhckNvZGVBdCgwKSwgJzknLmNoYXJDb2RlQXQoMCldO1xuXG52YXIgYmV0d2VlbiA9IGV4cG9ydHMuYmV0d2VlbiA9IGZ1bmN0aW9uIGJldHdlZW4odmFsdWUsIGxvd2VyLCBoaWdoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID49IGxvd2VyICYmIHZhbHVlIDw9IGhpZ2hlcjtcbn07XG5cbnZhciByYW5nZUluID0gZXhwb3J0cy5yYW5nZUluID0gZnVuY3Rpb24gcmFuZ2VJbihzdGFydCwgZW5kLCByYW5nZSkge1xuICByZXR1cm4gYmV0d2VlbihzdGFydCwgcmFuZ2VbMF0sIHJhbmdlWzFdKSAmJiBiZXR3ZWVuKGVuZCwgcmFuZ2VbMF0sIHJhbmdlWzFdKTtcbn07XG5cbnZhciByYW5nZUltcGwgPSBleHBvcnRzLnJhbmdlSW1wbCA9IGZ1bmN0aW9uIHJhbmdlSW1wbChzdGFydCwgZW5kLCBzdGVwLCBmKSB7XG4gIHZhciBsZW5ndGggPSBlbmQgLSBzdGFydDtcbiAgdmFyIGVsZW1lbnRzID0gc3RlcCA+IDEgPyBsZW5ndGggLSAoc3RlcCA9PSAxID8gMCA6IE1hdGgucm91bmQobGVuZ3RoIC8gc3RlcCkpIDogTWF0aC5yb3VuZChsZW5ndGggLyBzdGVwKTtcbiAgdmFyIGxzID0gbmV3IEFycmF5KGVsZW1lbnRzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGggJiYgaSA8PSBlbGVtZW50czsgaSsrKSB7XG4gICAgbHNbaV0gPSBmKGkgKiBzdGVwICsgc3RhcnQpO1xuICB9XG4gIHJldHVybiBscztcbn07XG5cbnZhciByYW5nZUNoYXIgPSBleHBvcnRzLnJhbmdlQ2hhciA9IGZ1bmN0aW9uIHJhbmdlQ2hhcihzdGFydCwgZW5kKSB7XG4gIHZhciB4ID0gc3RhcnQuY2hhckNvZGVBdCgwKTtcbiAgdmFyIHkgPSBlbmQuY2hhckNvZGVBdCgwKTtcbiAgdmFyIG9rID0gcmFuZ2VJbih4LCB5LCBjaGFyTG93ZXJSYW5nZSkgfHwgcmFuZ2VJbih4LCB5LCBjaGFyVXBwZXJSYW5nZSkgfHwgcmFuZ2VJbih4LCB5LCBjaGFyTnVtYmVyUmFuZ2UpO1xuICByZXR1cm4gb2sgPyByYW5nZUltcGwoeCwgeSArIDEsIDEsIFN0cmluZy5mcm9tQ2hhckNvZGUpIDogW107XG59O1xuXG52YXIgcmFuZ2VTdGVwID0gZXhwb3J0cy5yYW5nZVN0ZXAgPSBmdW5jdGlvbiByYW5nZVN0ZXAoc3RhcnQsIGVuZCwgc3RlcCkge1xuICByZXR1cm4gcmFuZ2VJbXBsKHN0YXJ0LCBlbmQsIHN0ZXAsIGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH0pO1xufTtcblxudmFyIHJhbmdlID0gZXhwb3J0cy5yYW5nZSA9IGZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHJhbmdlSW1wbChzdGFydCwgZW5kLCAxLCBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4O1xuICB9KTtcbn07XG5cbnZhciByYW5nZUluY2xTdGVwID0gZXhwb3J0cy5yYW5nZUluY2xTdGVwID0gZnVuY3Rpb24gcmFuZ2VJbmNsU3RlcChzdGFydCwgZW5kLCBzdGVwKSB7XG4gIHJldHVybiByYW5nZVN0ZXAoc3RhcnQsIGVuZCArIDEsIHN0ZXApO1xufTtcblxudmFyIHJhbmdlSW5jbCA9IGV4cG9ydHMucmFuZ2VJbmNsID0gZnVuY3Rpb24gcmFuZ2VJbmNsKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHJhbmdlKHN0YXJ0LCBlbmQgKyAxLCAxKTtcbn07XG4iLCJpbXBvcnQgeyByYW5nZUltcGwgfSBmcm9tICdqcy1zZGstcmFuZ2UnO1xuXG4vLyBsaXN0XG5leHBvcnQgZnVuY3Rpb24gY2h1bmsobHMsIG4pIHtcbiAgbGV0IGwgPSBscztcbiAgbGV0IHJlcyA9IFtdO1xuICB3aGlsZSAobC5sZW5ndGggPiAwKVxuICAgIHJlcy5wdXNoKGwuc3BsaWNlKDAsIG4pKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IGJlZ2luT2ZNb250aCA9IGQgPT4gbmV3IERhdGUoZC5nZXRGdWxsWWVhcigpLCBkLmdldE1vbnRoKCksIDEpO1xuZXhwb3J0IGNvbnN0IGVuZE9mTW9udGggPSBkID0+IG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpICsgMSwgMCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBtb250aEltcGwoZCwgZikge1xuICBjb25zdCBibSA9IGJlZ2luT2ZNb250aChkKTtcbiAgY29uc3QgZW0gPSBlbmRPZk1vbnRoKGQpO1xuXG4gIGNvbnN0IGxhc3REYXlPZldlZWsgPSBlbS5nZXREYXkoKTtcblxuICBjb25zdCBoZWFkRGF5cyA9IChuZXcgQXJyYXkoYm0uZ2V0RGF5KCkpKS5maWxsKG51bGwpO1xuICBjb25zdCB0YWlsRGF5cyA9IChuZXcgQXJyYXkoNiAtIGxhc3REYXlPZldlZWspKS5maWxsKG51bGwpO1xuXG4gIHJldHVybiBjaHVuayhoZWFkRGF5cy5jb25jYXQoXG4gICAgcmFuZ2VJbXBsKDEsIGVtLmdldERhdGUoKSArIDEsIDEsIGYpXG4gICkuY29uY2F0KHRhaWxEYXlzKSwgNyk7XG59XG5cbmV4cG9ydCBjb25zdCBtb250aCA9IGQgPT4gbW9udGhJbXBsKGQsIHggPT4geCk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpcnN0V2VlayA9IGQgPT4gKGQuZ2V0RGF0ZSgpIC0gZC5nZXREYXkoKSkgPCA3O1xuZXhwb3J0IGNvbnN0IGlzTGFzdFdlZWsgPSBkID0+IChkLmdldERhdGUoKSArICg2IC0gZC5nZXREYXkoKSkpID4gZW5kT2ZNb250aChkKS5nZXREYXRlKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiB3ZWVrSW1wbChkLCBmKSB7XG4gIGNvbnN0IHdlZWtkYXkgPSBkLmdldERheSgpO1xuICBjb25zdCBkYXkgPSBkLmdldERhdGUoKTtcblxuICBpZiAoaXNGaXJzdFdlZWsoZCkpIHtcbiAgICByZXR1cm4gKG5ldyBBcnJheSh3ZWVrZGF5KSkuZmlsbChudWxsKS5jb25jYXQoXG4gICAgICByYW5nZUltcGwoXG4gICAgICAgIE1hdGgubWF4KDEsIGRheSAtIHdlZWtkYXkpLFxuICAgICAgICBkYXkgKyAoNyAtIHdlZWtkYXkpLFxuICAgICAgICAxLFxuICAgICAgICBmXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc0xhc3RXZWVrKGQpKSB7XG4gICAgY29uc3QgZW9tID0gZW5kT2ZNb250aChkKTtcbiAgICByZXR1cm4gcmFuZ2VJbXBsKFxuICAgICAgZGF5IC0gd2Vla2RheSxcbiAgICAgIE1hdGgubWluKGVvbS5nZXREYXRlKCkgKyAxLCBkYXkgKyAoNyAtIHdlZWtkYXkpKSxcbiAgICAgIDEsXG4gICAgICBmXG4gICAgKS5jb25jYXQoXG4gICAgICAobmV3IEFycmF5KDYgLSBlb20uZ2V0RGF5KCkpKS5maWxsKG51bGwpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZUltcGwoXG4gICAgZGF5IC0gd2Vla2RheSxcbiAgICBkYXkgKyAoNyAtIHdlZWtkYXkpLFxuICAgIDEsIGZcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHdlZWsgPSBkYXRlID0+IHdlZWtJbXBsKGRhdGUsIHggPT4geCk7XG4iXX0=
