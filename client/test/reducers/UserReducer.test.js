import userReducer from '../../src/reducers/userReducer'
import * as UserActions from '../../src/actions/UserActions'

import * as chai from 'chai'
chai.should()

describe('userReducer', () => {
  it('should return the initial state if no state is passed', () => {
    const state = userReducer(undefined, {});

    state
      .should
      .deep
      .equal({isAuthenticated: false})
  });

  describe('SET_AUTH_STATUS', () => {
    it('should set isAuthenticated to "true", if it was false', () => {
      const initialState = {
        isAuthenticated: false
      };

      const state = userReducer(initialState, UserActions.setAuthStatus(true));

      state.isAuthenticated.should.be.true;
    });

    it('should set isAuthenticated to "false", if it was true before', () => {
      const initialState = {
        isAuthenticated: true
      };

      const state = userReducer(initialState, UserActions.setAuthStatus(false));

      state.isAuthenticated.should.be.false;
    });
  });
});