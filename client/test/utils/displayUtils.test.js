import * as displayUtils from '../../src/utils/displayUtils'

import * as chai from 'chai'
chai.should()

describe('displayUtils', () => {
  describe('formatBytes', () => {
    it('should show formatted bytes', () => {
      const bytes = 1024;
      let result = displayUtils.formatBytes(bytes);

      result
        .should
        .equal('1 kB');
    });

    it('should put exactly one space between number and unit', () => {
      const bytes = 11111;
      let result = displayUtils.formatBytes(bytes);

      result
        .should
        .match(/\d+\ {1}\w+/);
    });
  });

  describe('formatDate', () => {
    let date = new Date('2016-12-01 14:51:00');

    it('should format date as "d mmm yyyy, HH:MM:ss" by default', () => {
      let result = displayUtils.formatDate(date);
      result
        .should
        .equal('1 Dec 2016, 14:51:00');
    });

    it('should use format parameter if it is defined', () => {
      let result = displayUtils.formatDate(date, 'yyyy/mm/dd HH:MM');

      result
        .should
        .equal('2016/12/01 14:51');
    });
  });
});