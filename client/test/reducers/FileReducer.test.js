import fileReducer from '../../src/reducers/fileReducer'
import * as FileActions from '../../src/actions/FileActions'

import * as chai from 'chai'
chai.should()

describe('fileReducer', () => {
  it('should return the initial state if no state is passed', () => {
    fileReducer(undefined, {})
      .should
      .deep
      .equal({userFiles: []})
  });

  describe('SET_FILES', () => {
    it('should set userFiles to empty array', () => {
      const initialState = {
        userFiles: [
          {
            id: 1,
            name: 'file to be removed'
          }
        ]
      };

      const state = fileReducer(initialState, FileActions.setFiles([]));

      state.userFiles.should.be.empty;
    });

    it('should set userFiles to passed non-empty array', () => {
      const initialState = {
        userFiles: []
      };
      const files = [
        {
          id: 1,
          name: 'New file'
        }, {
          id: 2,
          name: 'Another new file'
        }
      ];

      const state = fileReducer(initialState, FileActions.setFiles(files));

      state
        .userFiles
        .should
        .have
        .lengthOf(files.length);
      state
        .userFiles
        .should
        .deep
        .equal(files);
    });
  });

  describe('ADD_NEW_FILE', () => {
    it('should add new file to existing ones', () => {
      const initialState = {
        userFiles: [
          {
            id: 1,
            name: 'Existing file'
          }
        ]
      };
      const newFile = {
        id: 2,
        name: 'New file'
      };

      const state = fileReducer(initialState, FileActions.addNewFile(newFile));

      state
        .userFiles
        .should
        .have
        .lengthOf(initialState.userFiles.length + 1)
      // array should contain new file object
      state
        .userFiles
        .should
        .deep
        .include
        .members([newFile]);
    });
  });
});