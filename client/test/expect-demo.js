var expect = require('chai').expect;

describe('Demotest with expect style syntax', function () {

  describe('2 + 2', function () {
    it('should equal 4', function () {
      expect(2 + 2)
        .to
        .equal(4);
    });

    it('should not equal 5', function () {
      expect(2 + 2)
        .to
        .not
        .equal(5);
    });
  });

});