import { rangeImpl } from 'js-sdk-range';
import { chunk } from 'js-sdk-list';

export const blankList = length =>
  (new Array(length)).fill(null);

export const isFirstWeek = d =>
  (d.getDate() - d.getDay()) < 7;

export const isLastWeek = d =>
  (d.getDate() + (6 - d.getDay())) > endOfMonth(d).getDate();

export const monthRange = (s, e, f) =>
  rangeImpl(s, e + 1, 1, f);

export const rangeInMonth = (d, s, e, f) => {
  const em = endOfMonth(d);
  return rangeImpl(d.getDate(),
                   Math.min(e + 1, em.getDate()), 1, f);
};

export const beginOfMonth = d =>
  new Date(d.getFullYear(), d.getMonth(), 1);

export const endOfMonth = d =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0);

export const beginOfDay = d =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const endOfDay = d =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 59);

export const beginOfNextMonth = d =>
  new Date(d.getFullYear(), d.getMonth() + 1, 1);

export const endOfPreviousMonth = d =>
  new Date(d.getFullYear(), d.getMonth(), 0);

export const firstWeekOfMonth = (d, f) =>
  rangeImpl(1, (8 - d.getDay()), 1, f);

export const firstWeekOfNextMonth = (d, f) =>
  firstWeekOfMonth(beginOfNextMonth(d), f);

export const lastWeekOfMonth = (d, f) =>
  monthRange(d.getDate() - d.getDay(), d.getDate(), f);

export const lastWeekOfPreviousMonth = (d, f) =>
  lastWeekOfMonth(endOfPreviousMonth(d), f);

export function monthImpl(d, f) {
  const bm = beginOfMonth(d);
  const em = endOfMonth(d);
  return chunk(
      blankList(bm.getDay()).concat(
        monthRange(1, em.getDate(), f)
      ).concat(
        blankList(6 - em.getDay())
      ),
    7
  );
}

export function monthCImpl(d, f) {
  const em = endOfMonth(d);
  return chunk(
    lastWeekOfPreviousMonth(d, f).concat(
      monthRange(1, em.getDate(), f)
    ).concat(
      firstWeekOfNextMonth(d, f)
    ),
    7
  );
}

export const month = d =>
  monthImpl(d, x => x);

export const monthC = d => monthCImpl(d, x => x);

export function weekImpl(d, f) {
  const weekday = d.getDay();
  const day = d.getDate();

  if (isFirstWeek(d)) {
    const bom = beginOfMonth(d);
    return blankList(bom.getDay()).concat(firstWeekOfMonth(bom, f));
  }

  if (isLastWeek(d)) {
    const eom = endOfMonth(d);
    return lastWeekOfMonth(eom, f).concat(blankList(6 - eom.getDay()));
  }

  return rangeImpl(
    day - weekday,
    day + (7 - weekday),
    1, f
  );
}

export const week = date =>
  weekImpl(date, x => x);

export function weekCImpl(d, f) {
  const weekday = d.getDay();
  const day = d.getDate();

  if (isFirstWeek(d)) {
    let lwpm = (day - weekday) == 1 ? [] : lastWeekOfPreviousMonth(d, f);
    return lwpm.concat(firstWeekOfMonth(d, f));
  }

  if (isLastWeek(d)) {
    const eom = endOfMonth(d);
    let fk = eom.getDay() == 6 ? [] : firstWeekOfNextMonth(d, f);
    return lastWeekOfMonth(d, f).concat(fk);
  }

  return rangeImpl(
    day - weekday,
    day + (7 - weekday),
    1, f
  );
}

export const weekC = d => weekCImpl(d, x => x);
