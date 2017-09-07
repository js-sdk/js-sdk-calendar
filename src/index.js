import { rangeImpl } from 'js-sdk-range';

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

export function monthImpl(d, f) {
  const bm = beginOfMonth(d);
  const em = endOfMonth(d);

  const lastDayOfWeek = em.getDay();

  const headDays = (new Array(bm.getDay())).fill(null);
  const tailDays = (new Array(6 - lastDayOfWeek)).fill(null);

  return chunk(headDays.concat(
    rangeImpl(1, em.getDate() + 1, 1, f)
  ).concat(tailDays), 7);
}

export const month = d => monthImpl(d, x => x);

export const isFirstWeek = d => (d.getDate() - d.getDay()) < 7;
export const isLastWeek = d => (d.getDate() + (6 - d.getDay())) > endOfMonth(d).getDate();

export function weekImpl(d, f) {
  const weekday = d.getDay();
  const day = d.getDate();

  if (isFirstWeek(d)) {
    return (new Array(weekday)).fill(null).concat(
      rangeImpl(
        Math.max(1, day - weekday),
        day + (7 - weekday),
        1,
        f
      )
    );
  }

  if (isLastWeek(d)) {
    const eom = endOfMonth(d);
    return rangeImpl(
      day - weekday,
      Math.min(eom.getDate() + 1, day + (7 - weekday)),
      1,
      f
    ).concat(
      (new Array(6 - eom.getDay())).fill(null)
    );
  }

  return rangeImpl(
    day - weekday,
    day + (7 - weekday),
    1, f
  );
}

export const week = date => weekImpl(date, x => x);
