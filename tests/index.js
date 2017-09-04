/* global describe, it, context */

import { rangeIncl } from 'js-sdk-range';

import * as C from '../src/index.js';

describe("Calendar", () => {
  context("month", () => {
    it("make calendar of january 2017.", () => {
      const A = new Date(2017, 0, 1);
      C.month(A).should.be.eql([
        rangeIncl(1, 7),
        rangeIncl(8, 14),
        rangeIncl(15, 21),
        rangeIncl(22, 28),
        [29, 30, 31, 0, 0, 0, 0]
      ]);
    });

    it("make calendar of february 2017.", () => {
      const A = new Date(2017, 1, 1);
      C.month(A).should.be.eql([
        [0, 0, 0].concat(rangeIncl(1, 4)),
        rangeIncl(5, 11),
        rangeIncl(12, 18),
        rangeIncl(19, 25),
        [26, 27, 28, 0, 0, 0, 0]
      ]);
    });
  });

  context("first and last week.", () => {
    it("first day of january 2017 is.", () => {
      const A = new Date(2017, 0, 1);
      C.isFirstWeek(A).should.be.ok();
    });

    it("8th day of january 2017 is not.", () => {
      const A = new Date(2017, 0, 8);
      (!C.isFirstWeek(A)).should.be.ok();
    });

    it("last day of january 2017 is not.", () => {
      const A = new Date(2017, 1, 0);
      (!C.isFirstWeek(A)).should.be.ok();
    });

    it("last day of month is always last week.", () => {
      const A = new Date(2017, 1, 0);
      C.isLastWeek(A).should.be.ok();
    });

    it("first day of month is always not in last week.", () => {
      const A = new Date(2017, 0, 1);
      (!C.isLastWeek(A)).should.be.ok();
    });
  });

  context("week", () => {
    it("first week of october 2017", () => {
      const A = new Date(2017, 9, 1);
      C.week(A).should.be.eql([
        1, 2, 3, 4, 5, 6, 7
      ]);
    });

    it("first week of february 2017", () => {
      const A = new Date(2017, 1, 1);
      C.week(A).should.be.eql([
        0, 0, 0, 1, 2, 3, 4,
      ]);
    });

    it("second week of january 2017.", () => {
      const A = new Date(2017, 0, 8);
      C.week(A).should.be.eql([
        8, 9, 10, 11, 12, 13, 14
      ]);
    });

    it("last week of february 2017", () => {
      const A = new Date(2017, 2, 0);
      C.week(A).should.be.eql([
        26, 27, 28, 0, 0, 0, 0
      ]);
    });
  });
});
