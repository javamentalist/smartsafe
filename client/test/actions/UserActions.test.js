import * as actions from '../../src/actions/UserActions'

import * as chai from 'chai'
chai.should()


describe('User actions', () => {

  it('should create an action to set authentication status', () => {

    const expectedAction = {
      type: actions.SET_AUTH_STATUS,
      payload: true
    }

    const action = actions.setAuthStatus(true)
    action.should.deep.equal(expectedAction)

  });
});