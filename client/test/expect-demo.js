import {expect} from 'chai'

describe('Demotest with expect style syntax', () => {

  describe('2 + 2', () => {
    it('should equal 4', () => {
      expect(2 + 2)
        .to
        .equal(4);
    })

    it('should not equal 5', () => {
      expect(2 + 2)
        .to
        .not
        .equal(5);
    })
  })
})