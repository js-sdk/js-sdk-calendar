import { rangeImpl } from 'js-sdk-range';
import { chunk, reserve } from 'js-sdk-list';

export const isFirstWeek = d =>
  (d.getDate() - d.getDay()) < 7;

export const isLastWeek = d =>
  (d.getDate() + (6 - d.getDay())) > endOfMonth(d).getDate();

export const monthRange = (s, e, f) =>
  rangeImpl(s, e + 1, 1, f);

export const rangeInMonth = (d, e, f) => {
  const em = endOfMonth(d);
  return rangeImpl(d.getDate(), Math.min(e + 1, em.getDate() + 1), 1, f);
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
      reserve(bm.getDay()).concat(
        monthRange(1, em.getDate(), f)
      ).concat(
        reserve(6 - em.getDay())
      ),
    7
  );
}

export const applyWithYearAndMonth = (f, date) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  return d => f(y, m, d);
};

export function monthCImpl(d, f) {
  const em = endOfMonth(d);
  const ldpm = endOfPreviousMonth(d);
  const fdnm = beginOfNextMonth(d);
  return chunk(
    lastWeekOfMonth(ldpm, applyWithYearAndMonth(f, ldpm)).concat(
      monthRange(1, em.getDate(), applyWithYearAndMonth(f, d))
    ).concat(
      firstWeekOfMonth(fdnm, applyWithYearAndMonth(f, fdnm))
    ),
    7
  );
}

export const month = d =>
  monthImpl(d, x => x);

export const monthC = d =>
  monthCImpl(d, (y, m, d) => [y, m, d]);

export function weekImpl(d, f) {
  const weekday = d.getDay();
  const day = d.getDate();

  if (isFirstWeek(d)) {
    const bom = beginOfMonth(d);
    return reserve(bom.getDay()).concat(firstWeekOfMonth(bom, f));
  }

  if (isLastWeek(d)) {
    const eom = endOfMonth(d);
    return lastWeekOfMonth(eom, f).concat(reserve(6 - eom.getDay()));
  }

  return rangeImpl(
    day - weekday,
    day + (7 - weekday),
    1, f
  );
}

export function weekCImpl(d, f) {
  const weekday = d.getDay();
  const day = d.getDate();
  const eom = endOfMonth(d);

  const proxyCurrentDate = applyWithYearAndMonth(f, d);

  if (isFirstWeek(d) && (day - weekday) != 1) {
    const eopm = endOfPreviousMonth(d);
    const proxyDate = applyWithYearAndMonth(f, eopm);
    return lastWeekOfMonth(eopm, proxyDate).concat(
      firstWeekOfMonth(d, proxyCurrentDate)
    );
  }

  if (isLastWeek(d) && eom.getDay() != 6) {
    const bom = beginOfNextMonth(d);
    const proxyDate = applyWithYearAndMonth(f, bom);
    return lastWeekOfMonth(d, proxyCurrentDate).concat(
      firstWeekOfMonth(bom, proxyDate)
    );
  }

  return rangeImpl(
    day - weekday,
    day + (7 - weekday),
    1, proxyCurrentDate
  );
}

export const week = date =>
  weekImpl(date, x => x);

export const weekC = d =>
  weekCImpl(d, (y, m, d) => [y, m, d]);
