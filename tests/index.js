/* global describe, it, context */

import { rangeIncl } from 'js-sdk-range';

import * as C from '../src/index.js';
import months from './months';
import weeks from './weeks';

describe("Calendar", () => {
  context("begin and end of month", () => {
    it("begin of the month.", () => {
      const A = new Date(2017, 0, 14);
      C.beginOfMonth(A).getDate().should.be.eql(1);
    });

    it("end of the month.", () => {
      const A = new Date(2017, 0, 14);
      C.endOfMonth(A).getDate().should.be.eql(31);
    });
  });

  context("first and last week.", () => {
    it("first day of january 2017 is first week.", () => {
      const A = new Date(2017, 0, 1);
      C.isFirstWeek(A).should.be.ok();
    });

    it("8th day of january 2017 is not first week.", () => {
      const A = new Date(2017, 0, 8);
      (!C.isFirstWeek(A)).should.be.ok();
    });

    it("last day of january 2017 is not first week.", () => {
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

  context("month", months);
  context("week", weeks);
});
