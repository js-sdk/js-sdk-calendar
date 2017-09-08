/* global describe, it, context */

import { rangeIncl } from 'js-sdk-range';

import * as C from '../src/index.js';

export default () => {
  context("non-continuous", () => {
    it("first week of october 2017", () => {
      const A = new Date(2017, 9, 1);
      C.week(A).should.be.eql([1, 2, 3, 4, 5, 6, 7]);
    });

    it("first week of february 2017", () => {
      const A = new Date(2017, 1, 1);
      C.week(A).should.be.eql([null, null, null, 1, 2, 3, 4]);
    });

    it("second week of january 2017.", () => {
      const A = new Date(2017, 0, 8);
      C.week(A).should.be.eql([8, 9, 10, 11, 12, 13, 14]);
    });

    it("last week of february 2017", () => {
      const A = new Date(2017, 2, 0);
      C.week(A).should.be.eql([26, 27, 28, null, null, null, null]);
    });

    it("use weekImpl to apply a function for each date.", () => {
      const A = new Date(2017, 2, 0);
      const makeDate = x => [2017, 1, x];

      C.weekImpl(A, makeDate).should.be.eql([
        makeDate(26),
        makeDate(27),
        makeDate(28),
        null, null, null, null
      ]);
    });
  });

  context("continuous", () => {
    it("first week of january 2017.", () => {
      const A = new Date(2017, 0, 1);
      C.weekC(A, x => x).should.be.eql([1, 2, 3, 4, 5, 6, 7]);
    });

    it("last week of february 2017.", () => {
      const A = new Date(2017, 2, 0);
      C.weekC(A, x => x).should.be.eql([26, 27, 28, 1, 2, 3, 4]);
    });
  });
};
