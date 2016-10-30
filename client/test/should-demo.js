import * as chai from 'chai'
let should = chai.should()

describe('Demotest with should style syntax', () => {

  describe('2 + 2', () => {
    it('should equal 4', () => {
      (2 + 2)
        .should
        .equal(4);
    })

    it('should not equal 5', () => {
      (2 + 2)
        .should
        .not
        .equal(5);
    })
  })
})