import * as actions from '../../src/actions/FileActions'

import * as chai from 'chai'
chai.should()


describe('File actions', () => {

  it('should create an action to set files', () => {
    const files = [{
      id: 1,
      path: "."
    }, {
      id: 2,
      path: ".."
    }]

    const expectedAction = {
      type: actions.SET_FILES,
      payload: files
    }

    const action = actions.setFiles(files)
    action.should.deep.equal(expectedAction)

  });


  it('should create an action to add a file', () => {
    const file = { id: 1, path: 'TODO' }
    const expectedAction = {
      type: actions.ADD_NEW_FILE,
      payload: file
    }

    const action = actions.addNewFile(file)

    action.should.deep.equal(expectedAction)
    // TODO remove this when action works with real file
    action.payload.path.should.not.equal('TODO')
  })
})