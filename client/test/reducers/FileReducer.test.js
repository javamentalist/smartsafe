import {fileReducer} from '../../src/reducers'
import * as FileActions from '../../src/actions/FileActions'

import * as chai from 'chai'
chai.should()

describe('fileReducer', () => {
  it('should return the initial state if no state is passed', () => {
    fileReducer(undefined, {})
      .should
      .deep
      .equal({myFiles: []})
  });

  describe('SET_FILES', () => {
    it('should set myFiles to empty array', () => {
      const initialState = {
        myFiles: [
          {
            id: 1,
            name: 'file to be removed'
          }
        ]
      };

      const state = fileReducer(initialState, FileActions.setFiles([]));

      state.myFiles.should.be.empty;
    });

    it('should set myFiles to passed non-empty array', () => {
      const initialState = {
        myFiles: []
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
        .myFiles
        .should
        .have
        .lengthOf(files.length);
      state
        .myFiles
        .should
        .deep
        .equal(files);
    });
  });

  describe('ADD_NEW_FILE', () => {
    it('should add new file to existing ones', () => {
      const initialState = {
        myFiles: [
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
        .myFiles
        .should
        .have
        .lengthOf(initialState.myFiles.length + 1)
      // array should contain new file object
      state
        .myFiles
        .should
        .deep
        .include
        .members([newFile]);
    });
  });
});