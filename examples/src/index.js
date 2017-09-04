import * as C from '../../src/index.js';

var monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
var weekDaysNames = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

var month = document.querySelector("#calendar .month");
var weekdays = document.querySelector("#calendar .weekdays");
var days = document.querySelector("#calendar .days");

var nodeCache;
var weekNodeCache;

var currentDate = new Date();
var monthCache = C.month(currentDate);

function createNode(c, f) {
  return d => {
    var node = document.createElement('div');
    node.className = c;
    node.innerHTML = f(d);
    return node;
  };
}

var dayName = d => d > 0 ? d : "";

function denyEvent(e) {
  if (!e.target.getAttribute('data-day')) {
    e.stopPropagation();
    return true;
  }
  return false;
}

function dateFromCalendarDate(date, day) {
  return new Date(date.getFullYear(),
                  date.getMonth(),
                  day);
}

function log(tag) {
  return event => {
    if (denyEvent(event)) { return; }
    const day = event.target.getAttribute('data-day');
    const date = dateFromCalendarDate(currentDate, day);
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
  cache.forEach((w, i) => {
    var week = calendar[i];
    nodeCache[i].forEach((n, d) => {
      var day = week && d < week.length ? week[d] : 0;
      (day > 0) && n.setAttribute('data-day', day);
      n.innerHTML = dayName(day);
    });
  });
}

function selectMonth(f) {
  return () => {
    var x = currentDate.getMonth();
    currentDate = new Date(currentDate.getFullYear(), f(x), 1);
    monthCache = C.month(currentDate);
    updateCalendar(weekNodeCache, currentDate, monthCache);
  };
}

const nextMonth = x => x + 1 > 11 ? 0 : x + 1;
const previousMonth = x => x - 1 < 0 ? 11 : x - 1;

var weekdayNode = createNode('weekday', d => d);
var weekNode = createNode('week', d => "");
var dayNode = createNode('day', dayName);

weekNodeCache = (new Array(6)).fill().map(weekNode);
nodeCache = weekNodeCache.map(_ => (new Array(7)).fill().map(dayNode));

var weekdayCache = weekDaysNames.map(weekdayNode);

weekdayCache.forEach(n => weekdays.appendChild(n));
weekNodeCache.forEach((w, i) => {
  nodeCache[i].forEach((n) => {
    setupEventListeners(n);
    w.appendChild(n);
  });
  days.append(w);
});

document.querySelector("#next").addEventListener('click', selectMonth(nextMonth));
document.querySelector("#previous").addEventListener('click', selectMonth(previousMonth));

updateCalendar(weekNodeCache, currentDate, monthCache);
