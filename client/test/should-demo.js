var should = require('chai').should();

describe('Demotest with should style syntax', function () {

  describe('2 + 2', function () {
    it('should equal 4', function () {
      (2 + 2)
        .should
        .equal(4);
    });

    it('should not equal 5', function () {
      (2 + 2)
        .should
        .not
        .equal(5);
    });
  });
});