/* global describe, it, context */

import { rangeIncl } from 'js-sdk-range';

import * as C from '../src/index.js';

export default () => {
  context("non-continuous", () => {
    it("make calendar of january 2017.", () => {
      const A = new Date(2017, 0, 1);
      C.month(A).should.be.eql([
        rangeIncl(1, 7),
        rangeIncl(8, 14),
        rangeIncl(15, 21),
        rangeIncl(22, 28),
        [29, 30, 31, null, null, null, null]
      ]);
    });

    it("make calendar of february 2017.", () => {
      const A = new Date(2017, 1, 1);
      C.month(A).should.be.eql([
        [null, null, null].concat(rangeIncl(1, 4)),
        rangeIncl(5, 11),
        rangeIncl(12, 18),
        rangeIncl(19, 25),
        [26, 27, 28, null, null, null, null]
      ]);
    });
  });

  context("continuous", () => {
    it("month of february 2017.", () => {
      const A = new Date(2017, 1, 1);
      C.monthC(A).reduce((acc, week) => {
        return week.reduce((acc, [_, m, d]) => {
          acc[m].push(d);
          return acc;
        }, acc);
      }, [[], [], []]).map(
        days => days.length
      ).should.be.eql([3, 28, 4]);
    });
  });
};
