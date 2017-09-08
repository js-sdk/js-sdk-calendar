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
exports.weekC = exports.week = exports.monthC = exports.month = exports.lastWeekOfPreviousMonth = exports.lastWeekOfMonth = exports.firstWeekOfNextMonth = exports.firstWeekOfMonth = exports.endOfPreviousMonth = exports.beginOfNextMonth = exports.endOfMonth = exports.beginOfMonth = exports.rangeInMonth = exports.monthRange = exports.isLastWeek = exports.isFirstWeek = exports.blankList = undefined;
exports.chunk = chunk;
exports.monthImpl = monthImpl;
exports.monthCImpl = monthCImpl;
exports.weekImpl = weekImpl;
exports.weekCImpl = weekCImpl;

var _jsSdkRange = require('js-sdk-range');

// list
function chunk(ls, n) {
  var l = ls;
  var res = [];
  while (l.length > 0) {
    res.push(l.splice(0, n));
  }return res;
}

var blankList = exports.blankList = function blankList(length) {
  return new Array(length).fill(null);
};

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
  return chunk(blankList(bm.getDay()).concat(monthRange(1, em.getDate(), f)).concat(blankList(6 - em.getDay())), 7);
}

function monthCImpl(d, f) {
  var em = endOfMonth(d);
  return chunk(lastWeekOfPreviousMonth(d, f).concat(monthRange(1, em.getDate(), f)).concat(firstWeekOfNextMonth(d, f)), 7);
}

var month = exports.month = function month(d) {
  return monthImpl(d, function (x) {
    return x;
  });
};

var monthC = exports.monthC = function monthC(d) {
  return monthCImpl(d, function (x) {
    return x;
  });
};

function weekImpl(d, f) {
  var weekday = d.getDay();
  var day = d.getDate();

  if (isFirstWeek(d)) {
    var bom = beginOfMonth(d);
    return blankList(bom.getDay()).concat(firstWeekOfMonth(bom, f));
  }

  if (isLastWeek(d)) {
    var eom = endOfMonth(d);
    return lastWeekOfMonth(eom, f).concat(blankList(6 - eom.getDay()));
  }

  return (0, _jsSdkRange.rangeImpl)(day - weekday, day + (7 - weekday), 1, f);
}

var week = exports.week = function week(date) {
  return weekImpl(date, function (x) {
    return x;
  });
};

function weekCImpl(d, f) {
  var weekday = d.getDay();
  var day = d.getDate();

  if (isFirstWeek(d)) {
    var lwpm = day - weekday == 1 ? [] : lastWeekOfPreviousMonth(d, f);
    return lwpm.concat(firstWeekOfMonth(d, f));
  }

  if (isLastWeek(d)) {
    var eom = endOfMonth(d);
    var fk = eom.getDay() == 6 ? [] : firstWeekOfNextMonth(d, f);
    return lastWeekOfMonth(d, f).concat(fk);
  }

  return (0, _jsSdkRange.rangeImpl)(day - weekday, day + (7 - weekday), 1, f);
}

var weekC = exports.weekC = function weekC(d) {
  return weekCImpl(d, function (x) {
    return x;
  });
};

},{"js-sdk-range":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtc2RrLXJhbmdlL2xpYi9yYW5nZS5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0lBQVksQzs7OztBQUVaLElBQUksYUFBYSxDQUNmLFNBRGUsRUFDSixVQURJLEVBQ1EsT0FEUixFQUNpQixPQURqQixFQUMwQixLQUQxQixFQUNpQyxNQURqQyxFQUVmLE1BRmUsRUFFUCxRQUZPLEVBRUcsV0FGSCxFQUVnQixTQUZoQixFQUUyQixVQUYzQixFQUV1QyxVQUZ2QyxDQUFqQjtBQUlBLElBQUksZ0JBQWdCLENBQ2xCLEtBRGtCLEVBQ1gsS0FEVyxFQUNKLEtBREksRUFDRyxLQURILEVBQ1UsS0FEVixFQUNpQixLQURqQixFQUN3QixLQUR4QixDQUFwQjs7QUFJQSxJQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLGtCQUF2QixDQUFaO0FBQ0EsSUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixxQkFBdkIsQ0FBZjtBQUNBLElBQUksT0FBTyxTQUFTLGFBQVQsQ0FBdUIsaUJBQXZCLENBQVg7O0FBRUEsSUFBSSxTQUFKO0FBQ0EsSUFBSSxhQUFKOztBQUVBLElBQUksY0FBYyxJQUFJLElBQUosRUFBbEI7QUFDQSxJQUFJLGFBQWEsRUFBRSxLQUFGLENBQVEsV0FBUixDQUFqQjs7QUFFQSxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsRUFBMEI7QUFDeEIsU0FBTyxhQUFLO0FBQ1YsUUFBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEVBQUUsQ0FBRixDQUFqQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBTEQ7QUFNRDs7QUFFRCxJQUFJLFVBQVUsU0FBVixPQUFV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QUFaLENBQVA7QUFDRDs7QUFFRCxNQUFJLFdBQVcsQ0FBWCxDQUFKLEVBQW1CO0FBQ2pCLFFBQU0sTUFBTSxXQUFXLENBQVgsQ0FBWjtBQUNBLFFBQUksS0FBSyxJQUFJLE1BQUosTUFBZ0IsQ0FBaEIsR0FBb0IsRUFBcEIsR0FBeUIscUJBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBQWxDO0FBQ0EsV0FBTyxnQkFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsTUFBdEIsQ0FBNkIsRUFBN0IsQ0FBUDtBQUNEOztBQUVELFNBQU8sMkJBQ0wsTUFBTSxPQURELEVBRUwsT0FBTyxJQUFJLE9BQVgsQ0FGSyxFQUdMLENBSEssRUFHRixDQUhFLENBQVA7QUFLRDs7QUFFTSxJQUFNLHdCQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUssVUFBVSxDQUFWLEVBQWE7QUFBQSxXQUFLLENBQUw7QUFBQSxHQUFiLENBQUw7QUFBQSxDQUFkIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEMgZnJvbSAnLi4vLi4vc3JjL2luZGV4LmpzJztcblxudmFyIG1vbnRoTmFtZXMgPSBbXG4gICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcbiAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ1xuXTtcbnZhciB3ZWVrRGF5c05hbWVzID0gW1xuICAnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J1xuXTtcblxudmFyIG1vbnRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYWxlbmRhciAubW9udGhcIik7XG52YXIgd2Vla2RheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbGVuZGFyIC53ZWVrZGF5c1wiKTtcbnZhciBkYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYWxlbmRhciAuZGF5c1wiKTtcblxudmFyIG5vZGVDYWNoZTtcbnZhciB3ZWVrTm9kZUNhY2hlO1xuXG52YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xudmFyIG1vbnRoQ2FjaGUgPSBDLm1vbnRoKGN1cnJlbnREYXRlKTtcblxuZnVuY3Rpb24gY3JlYXRlTm9kZShjLCBmKSB7XG4gIHJldHVybiBkID0+IHtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vZGUuY2xhc3NOYW1lID0gYztcbiAgICBub2RlLmlubmVySFRNTCA9IGYoZCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG59XG5cbnZhciBkYXlOYW1lID0gZCA9PiBkID8gZCA6IFwiXCI7XG5cbmZ1bmN0aW9uIGRlbnlFdmVudChlKSB7XG4gIGlmICghZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWRheScpKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRhdGVGcm9tQ2FsZW5kYXJEYXRlKGRhdGUsIGRheSkge1xuICByZXR1cm4gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgICAgICAgZGF0ZS5nZXRNb250aCgpLFxuICAgICAgICAgICAgICAgICAgZGF5KTtcbn1cblxuZnVuY3Rpb24gbG9nKHRhZykge1xuICByZXR1cm4gZXZlbnQgPT4ge1xuICAgIGlmIChkZW55RXZlbnQoZXZlbnQpKSB7IHJldHVybjsgfVxuICAgIGNvbnN0IGRheSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF5Jyk7XG4gICAgY29uc3QgZGF0ZSA9IGRhdGVGcm9tQ2FsZW5kYXJEYXRlKGN1cnJlbnREYXRlLCBkYXkpO1xuICAgIGNvbnNvbGUubG9nKHRhZywgZGF0ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRMaXN0ZW5lcnMobikge1xuICBuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nKFwiQ2xpY2tlZDpcIikpO1xuICBuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGxvZyhcIk1vdXNlIG92ZXI6XCIpKTtcbiAgbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGxvZyhcIk1vdXNlIG91dDpcIikpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDYWxlbmRhcihjYWNoZSwgZGF0ZSwgY2FsZW5kYXIpIHtcbiAgbW9udGguaW5uZXJIVE1MID0gbW9udGhOYW1lc1tkYXRlLmdldE1vbnRoKCldO1xuICBjYWNoZS5mb3JFYWNoKCh3LCBpKSA9PiB7XG4gICAgdmFyIHdlZWsgPSBjYWxlbmRhcltpXTtcbiAgICBub2RlQ2FjaGVbaV0uZm9yRWFjaCgobiwgZCkgPT4ge1xuICAgICAgdmFyIGRheSA9IHdlZWsgJiYgZCA8IHdlZWsubGVuZ3RoID8gd2Vla1tkXSA6IDA7XG4gICAgICBkYXkgJiYgbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGF5JywgZGF5KTtcbiAgICAgIG4uaW5uZXJIVE1MID0gZGF5TmFtZShkYXkpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0TW9udGgoZikge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHZhciB4ID0gY3VycmVudERhdGUuZ2V0TW9udGgoKTtcbiAgICBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCksIGYoeCksIDEpO1xuICAgIG1vbnRoQ2FjaGUgPSBDLm1vbnRoKGN1cnJlbnREYXRlKTtcbiAgICB1cGRhdGVDYWxlbmRhcih3ZWVrTm9kZUNhY2hlLCBjdXJyZW50RGF0ZSwgbW9udGhDYWNoZSk7XG4gIH07XG59XG5cbmNvbnN0IG5leHRNb250aCA9IHggPT4geCArIDEgPiAxMSA/IDAgOiB4ICsgMTtcbmNvbnN0IHByZXZpb3VzTW9udGggPSB4ID0+IHggLSAxIDwgMCA/IDExIDogeCAtIDE7XG5cbnZhciB3ZWVrZGF5Tm9kZSA9IGNyZWF0ZU5vZGUoJ3dlZWtkYXknLCBkID0+IGQpO1xudmFyIHdlZWtOb2RlID0gY3JlYXRlTm9kZSgnd2VlaycsIGQgPT4gXCJcIik7XG52YXIgZGF5Tm9kZSA9IGNyZWF0ZU5vZGUoJ2RheScsIGRheU5hbWUpO1xuXG53ZWVrTm9kZUNhY2hlID0gKG5ldyBBcnJheSg2KSkuZmlsbCgpLm1hcCh3ZWVrTm9kZSk7XG5ub2RlQ2FjaGUgPSB3ZWVrTm9kZUNhY2hlLm1hcChfID0+IChuZXcgQXJyYXkoNykpLmZpbGwoKS5tYXAoZGF5Tm9kZSkpO1xuXG52YXIgd2Vla2RheUNhY2hlID0gd2Vla0RheXNOYW1lcy5tYXAod2Vla2RheU5vZGUpO1xuXG53ZWVrZGF5Q2FjaGUuZm9yRWFjaChuID0+IHdlZWtkYXlzLmFwcGVuZENoaWxkKG4pKTtcbndlZWtOb2RlQ2FjaGUuZm9yRWFjaCgodywgaSkgPT4ge1xuICBub2RlQ2FjaGVbaV0uZm9yRWFjaCgobikgPT4ge1xuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMobik7XG4gICAgdy5hcHBlbmRDaGlsZChuKTtcbiAgfSk7XG4gIGRheXMuYXBwZW5kKHcpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdE1vbnRoKG5leHRNb250aCkpO1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmV2aW91c1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdE1vbnRoKHByZXZpb3VzTW9udGgpKTtcblxudXBkYXRlQ2FsZW5kYXIod2Vla05vZGVDYWNoZSwgY3VycmVudERhdGUsIG1vbnRoQ2FjaGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGNoYXJMb3dlclJhbmdlID0gZXhwb3J0cy5jaGFyTG93ZXJSYW5nZSA9IFsnYScuY2hhckNvZGVBdCgwKSwgJ3onLmNoYXJDb2RlQXQoMCldO1xudmFyIGNoYXJVcHBlclJhbmdlID0gZXhwb3J0cy5jaGFyVXBwZXJSYW5nZSA9IFsnQScuY2hhckNvZGVBdCgwKSwgJ1onLmNoYXJDb2RlQXQoMCldO1xudmFyIGNoYXJOdW1iZXJSYW5nZSA9IGV4cG9ydHMuY2hhck51bWJlclJhbmdlID0gWycwJy5jaGFyQ29kZUF0KDApLCAnOScuY2hhckNvZGVBdCgwKV07XG5cbnZhciBiZXR3ZWVuID0gZXhwb3J0cy5iZXR3ZWVuID0gZnVuY3Rpb24gYmV0d2Vlbih2YWx1ZSwgbG93ZXIsIGhpZ2hlcikge1xuICByZXR1cm4gdmFsdWUgPj0gbG93ZXIgJiYgdmFsdWUgPD0gaGlnaGVyO1xufTtcblxudmFyIHJhbmdlSW4gPSBleHBvcnRzLnJhbmdlSW4gPSBmdW5jdGlvbiByYW5nZUluKHN0YXJ0LCBlbmQsIHJhbmdlKSB7XG4gIHJldHVybiBiZXR3ZWVuKHN0YXJ0LCByYW5nZVswXSwgcmFuZ2VbMV0pICYmIGJldHdlZW4oZW5kLCByYW5nZVswXSwgcmFuZ2VbMV0pO1xufTtcblxudmFyIHJhbmdlSW1wbCA9IGV4cG9ydHMucmFuZ2VJbXBsID0gZnVuY3Rpb24gcmFuZ2VJbXBsKHN0YXJ0LCBlbmQsIHN0ZXAsIGYpIHtcbiAgdmFyIGxlbmd0aCA9IGVuZCAtIHN0YXJ0O1xuICB2YXIgZWxlbWVudHMgPSBzdGVwID4gMSA/IGxlbmd0aCAtIChzdGVwID09IDEgPyAwIDogTWF0aC5yb3VuZChsZW5ndGggLyBzdGVwKSkgOiBNYXRoLnJvdW5kKGxlbmd0aCAvIHN0ZXApO1xuICB2YXIgbHMgPSBuZXcgQXJyYXkoZWxlbWVudHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aCAmJiBpIDw9IGVsZW1lbnRzOyBpKyspIHtcbiAgICBsc1tpXSA9IGYoaSAqIHN0ZXAgKyBzdGFydCk7XG4gIH1cbiAgcmV0dXJuIGxzO1xufTtcblxudmFyIHJhbmdlQ2hhciA9IGV4cG9ydHMucmFuZ2VDaGFyID0gZnVuY3Rpb24gcmFuZ2VDaGFyKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHggPSBzdGFydC5jaGFyQ29kZUF0KDApO1xuICB2YXIgeSA9IGVuZC5jaGFyQ29kZUF0KDApO1xuICB2YXIgb2sgPSByYW5nZUluKHgsIHksIGNoYXJMb3dlclJhbmdlKSB8fCByYW5nZUluKHgsIHksIGNoYXJVcHBlclJhbmdlKSB8fCByYW5nZUluKHgsIHksIGNoYXJOdW1iZXJSYW5nZSk7XG4gIHJldHVybiBvayA/IHJhbmdlSW1wbCh4LCB5ICsgMSwgMSwgU3RyaW5nLmZyb21DaGFyQ29kZSkgOiBbXTtcbn07XG5cbnZhciByYW5nZVN0ZXAgPSBleHBvcnRzLnJhbmdlU3RlcCA9IGZ1bmN0aW9uIHJhbmdlU3RlcChzdGFydCwgZW5kLCBzdGVwKSB7XG4gIHJldHVybiByYW5nZUltcGwoc3RhcnQsIGVuZCwgc3RlcCwgZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geDtcbiAgfSk7XG59O1xuXG52YXIgcmFuZ2UgPSBleHBvcnRzLnJhbmdlID0gZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gcmFuZ2VJbXBsKHN0YXJ0LCBlbmQsIDEsIGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH0pO1xufTtcblxudmFyIHJhbmdlSW5jbFN0ZXAgPSBleHBvcnRzLnJhbmdlSW5jbFN0ZXAgPSBmdW5jdGlvbiByYW5nZUluY2xTdGVwKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgcmV0dXJuIHJhbmdlU3RlcChzdGFydCwgZW5kICsgMSwgc3RlcCk7XG59O1xuXG52YXIgcmFuZ2VJbmNsID0gZXhwb3J0cy5yYW5nZUluY2wgPSBmdW5jdGlvbiByYW5nZUluY2woc3RhcnQsIGVuZCkge1xuICByZXR1cm4gcmFuZ2Uoc3RhcnQsIGVuZCArIDEsIDEpO1xufTtcbiIsImltcG9ydCB7IHJhbmdlSW1wbCB9IGZyb20gJ2pzLXNkay1yYW5nZSc7XG5cbi8vIGxpc3RcbmV4cG9ydCBmdW5jdGlvbiBjaHVuayhscywgbikge1xuICBsZXQgbCA9IGxzO1xuICBsZXQgcmVzID0gW107XG4gIHdoaWxlIChsLmxlbmd0aCA+IDApXG4gICAgcmVzLnB1c2gobC5zcGxpY2UoMCwgbikpO1xuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgY29uc3QgYmxhbmtMaXN0ID0gbGVuZ3RoID0+XG4gIChuZXcgQXJyYXkobGVuZ3RoKSkuZmlsbChudWxsKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RXZWVrID0gZCA9PlxuICAoZC5nZXREYXRlKCkgLSBkLmdldERheSgpKSA8IDc7XG5cbmV4cG9ydCBjb25zdCBpc0xhc3RXZWVrID0gZCA9PlxuICAoZC5nZXREYXRlKCkgKyAoNiAtIGQuZ2V0RGF5KCkpKSA+IGVuZE9mTW9udGgoZCkuZ2V0RGF0ZSgpO1xuXG5leHBvcnQgY29uc3QgbW9udGhSYW5nZSA9IChzLCBlLCBmKSA9PlxuICByYW5nZUltcGwocywgZSArIDEsIDEsIGYpO1xuXG5leHBvcnQgY29uc3QgcmFuZ2VJbk1vbnRoID0gKGQsIHMsIGUsIGYpID0+IHtcbiAgY29uc3QgZW0gPSBlbmRPZk1vbnRoKGQpO1xuICByZXR1cm4gcmFuZ2VJbXBsKGQuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgIE1hdGgubWluKGUgKyAxLCBlbS5nZXREYXRlKCkpLCAxLCBmKTtcbn07XG5cbmV4cG9ydCBjb25zdCBiZWdpbk9mTW9udGggPSBkID0+XG4gIG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpLCAxKTtcblxuZXhwb3J0IGNvbnN0IGVuZE9mTW9udGggPSBkID0+XG4gIG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpICsgMSwgMCk7XG5cbmV4cG9ydCBjb25zdCBiZWdpbk9mTmV4dE1vbnRoID0gZCA9PlxuICBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSArIDEsIDEpO1xuXG5leHBvcnQgY29uc3QgZW5kT2ZQcmV2aW91c01vbnRoID0gZCA9PlxuICBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSwgMCk7XG5cbmV4cG9ydCBjb25zdCBmaXJzdFdlZWtPZk1vbnRoID0gKGQsIGYpID0+XG4gIHJhbmdlSW1wbCgxLCAoOCAtIGQuZ2V0RGF5KCkpLCAxLCBmKTtcblxuZXhwb3J0IGNvbnN0IGZpcnN0V2Vla09mTmV4dE1vbnRoID0gKGQsIGYpID0+XG4gIGZpcnN0V2Vla09mTW9udGgoYmVnaW5PZk5leHRNb250aChkKSwgZik7XG5cbmV4cG9ydCBjb25zdCBsYXN0V2Vla09mTW9udGggPSAoZCwgZikgPT5cbiAgbW9udGhSYW5nZShkLmdldERhdGUoKSAtIGQuZ2V0RGF5KCksIGQuZ2V0RGF0ZSgpLCBmKTtcblxuZXhwb3J0IGNvbnN0IGxhc3RXZWVrT2ZQcmV2aW91c01vbnRoID0gKGQsIGYpID0+XG4gIGxhc3RXZWVrT2ZNb250aChlbmRPZlByZXZpb3VzTW9udGgoZCksIGYpO1xuXG5leHBvcnQgZnVuY3Rpb24gbW9udGhJbXBsKGQsIGYpIHtcbiAgY29uc3QgYm0gPSBiZWdpbk9mTW9udGgoZCk7XG4gIGNvbnN0IGVtID0gZW5kT2ZNb250aChkKTtcbiAgcmV0dXJuIGNodW5rKFxuICAgICAgYmxhbmtMaXN0KGJtLmdldERheSgpKS5jb25jYXQoXG4gICAgICAgIG1vbnRoUmFuZ2UoMSwgZW0uZ2V0RGF0ZSgpLCBmKVxuICAgICAgKS5jb25jYXQoXG4gICAgICAgIGJsYW5rTGlzdCg2IC0gZW0uZ2V0RGF5KCkpXG4gICAgICApLFxuICAgIDdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vbnRoQ0ltcGwoZCwgZikge1xuICBjb25zdCBlbSA9IGVuZE9mTW9udGgoZCk7XG4gIHJldHVybiBjaHVuayhcbiAgICBsYXN0V2Vla09mUHJldmlvdXNNb250aChkLCBmKS5jb25jYXQoXG4gICAgICBtb250aFJhbmdlKDEsIGVtLmdldERhdGUoKSwgZilcbiAgICApLmNvbmNhdChcbiAgICAgIGZpcnN0V2Vla09mTmV4dE1vbnRoKGQsIGYpXG4gICAgKSxcbiAgICA3XG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBtb250aCA9IGQgPT5cbiAgbW9udGhJbXBsKGQsIHggPT4geCk7XG5cbmV4cG9ydCBjb25zdCBtb250aEMgPSBkID0+IG1vbnRoQ0ltcGwoZCwgeCA9PiB4KTtcblxuZXhwb3J0IGZ1bmN0aW9uIHdlZWtJbXBsKGQsIGYpIHtcbiAgY29uc3Qgd2Vla2RheSA9IGQuZ2V0RGF5KCk7XG4gIGNvbnN0IGRheSA9IGQuZ2V0RGF0ZSgpO1xuXG4gIGlmIChpc0ZpcnN0V2VlayhkKSkge1xuICAgIGNvbnN0IGJvbSA9IGJlZ2luT2ZNb250aChkKTtcbiAgICByZXR1cm4gYmxhbmtMaXN0KGJvbS5nZXREYXkoKSkuY29uY2F0KGZpcnN0V2Vla09mTW9udGgoYm9tLCBmKSk7XG4gIH1cblxuICBpZiAoaXNMYXN0V2VlayhkKSkge1xuICAgIGNvbnN0IGVvbSA9IGVuZE9mTW9udGgoZCk7XG4gICAgcmV0dXJuIGxhc3RXZWVrT2ZNb250aChlb20sIGYpLmNvbmNhdChibGFua0xpc3QoNiAtIGVvbS5nZXREYXkoKSkpO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlSW1wbChcbiAgICBkYXkgLSB3ZWVrZGF5LFxuICAgIGRheSArICg3IC0gd2Vla2RheSksXG4gICAgMSwgZlxuICApO1xufVxuXG5leHBvcnQgY29uc3Qgd2VlayA9IGRhdGUgPT5cbiAgd2Vla0ltcGwoZGF0ZSwgeCA9PiB4KTtcblxuZXhwb3J0IGZ1bmN0aW9uIHdlZWtDSW1wbChkLCBmKSB7XG4gIGNvbnN0IHdlZWtkYXkgPSBkLmdldERheSgpO1xuICBjb25zdCBkYXkgPSBkLmdldERhdGUoKTtcblxuICBpZiAoaXNGaXJzdFdlZWsoZCkpIHtcbiAgICBsZXQgbHdwbSA9IChkYXkgLSB3ZWVrZGF5KSA9PSAxID8gW10gOiBsYXN0V2Vla09mUHJldmlvdXNNb250aChkLCBmKTtcbiAgICByZXR1cm4gbHdwbS5jb25jYXQoZmlyc3RXZWVrT2ZNb250aChkLCBmKSk7XG4gIH1cblxuICBpZiAoaXNMYXN0V2VlayhkKSkge1xuICAgIGNvbnN0IGVvbSA9IGVuZE9mTW9udGgoZCk7XG4gICAgbGV0IGZrID0gZW9tLmdldERheSgpID09IDYgPyBbXSA6IGZpcnN0V2Vla09mTmV4dE1vbnRoKGQsIGYpO1xuICAgIHJldHVybiBsYXN0V2Vla09mTW9udGgoZCwgZikuY29uY2F0KGZrKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZUltcGwoXG4gICAgZGF5IC0gd2Vla2RheSxcbiAgICBkYXkgKyAoNyAtIHdlZWtkYXkpLFxuICAgIDEsIGZcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHdlZWtDID0gZCA9PiB3ZWVrQ0ltcGwoZCwgeCA9PiB4KTtcbiJdfQ==
