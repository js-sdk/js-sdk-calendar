import { range, rangeIncl } from 'js-sdk-range';

// list
export function chunk(ls, n) {
  let l = ls;
  let res = [];
  while (l.length > 0)
    res.push(l.splice(0, n));
  return res;
}

export const beginOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1);
export const endOfMonth = d => new Date(d.getFullYear(), d.getMonth() + 1, 0);

export function month(a) {
  const bm = beginOfMonth(a);
  const em = endOfMonth(a);

  const lastDayOfWeek = em.getDay();

  const headDays = (new Array(bm.getDay())).fill(0);
  const tailDays = (new Array(lastDayOfWeek < 6 ? 6 - lastDayOfWeek : 0)).fill(0);

  return chunk(headDays.concat(
    rangeIncl(1, em.getDate())
  ).concat(tailDays), 7);
}

export const isFirstWeek = d => (d.getDate() - d.getDay()) < 7;
export const isLastWeek = d => (d.getDate() + (6 - d.getDay())) > endOfMonth(d).getDate();

export function week(d) {
  const weekday = d.getDay();
  const day = d.getDate();

  if (isFirstWeek(d)) {
    return (new Array(weekday)).fill(0).concat(
      range(
        Math.max(1, day - weekday),
        day + (7 - weekday)
      )
    );
  }

  if (isLastWeek(d)) {
    const eom = endOfMonth(d);
    return range(
      day - weekday,
      Math.min(eom.getDate() + 1, day + (7 - weekday))
    ).concat(
      (new Array(6 - eom.getDay())).fill(0)
    );
  }

  return range(day - weekday, day + (7 - weekday));
}
