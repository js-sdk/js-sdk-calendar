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
      C.monthC(A, x => x).should.be.eql([
        [29, 30, 31].concat(rangeIncl(1, 4)),
        rangeIncl(5, 11),
        rangeIncl(12, 18),
        rangeIncl(19, 25),
        [26, 27, 28, 1, 2, 3, 4]
      ]);
    });
  });
};
