import * as actions from '../../src/actions/FileActions'

import * as chai from 'chai'
chai.should()

describe('File actions', () => {

  it('should create an action to set files', () => {
    const files = [
      {
        id: 1,
        path: "."
      }, {
        id: 2,
        path: ".."
      }
    ]

    const expectedAction = {
      type: actions.SET_FILES,
      payload: files
    }

    const action = actions.setFiles(files)
    action.should.deep.equal(expectedAction)

  });

  it('should create an action to set one file as detailed', () => {
    const id = 1;
    const expectedAction = {
      type: actions.SET_DETAIL,
      payload: id
    }

    const action = actions.setDetail(id);

    action.should.deep.equal(expectedAction);

  });

  it('should create an action to add a file to upload queue', () => {
    const file = {
      path: '/path/to/file'
    }
    const expectedAction = {
      type: actions.ADD_FILE_TO_UPLOAD_QUEUE,
      payload: file
    }

    const action = actions.addFileToUploadQueue(file)

    action.should.deep.equal(expectedAction)
  });

  it('should create an action to remove file from upload queue', () => {
    const file = {
      path: '/path/to/file'
    }
    const expectedAction = {
      type: actions.REMOVE_FILE_FROM_UPLOAD_QUEUE,
      payload: file
    }

    const action = actions.removeFileFromUploadQueue(file)

    action.should.deep.equal(expectedAction)
  });

  it('should create action to start file upload', () => {
    (0).should.equal(1);
  });

  it('should create action to set upload as finished', () => {
    (0).should.equal(1);
  });

  it('should create action to update upload progress', () => {
    (0).should.equal(1);
  });
})