import fileReducer from '../../src/reducers/fileReducer'
import * as FileActions from '../../src/actions/FileActions'

import * as chai from 'chai'
chai.should()

describe('fileReducer', () => {
  it('should return the initial state if no state is passed', () => {
    fileReducer(undefined, {})
      .should
      .deep
      .equal({userFiles: [], detailedFile: {}})
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

      (state.userFiles).should.be.empty;
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

      (state.userFiles)
        .should
        .have
        .lengthOf(files.length);
      (state.userFiles)
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

      (state.userFiles)
        .should
        .have
        .lengthOf(initialState.userFiles.length + 1);
      // array should contain new file object
      (state.userFiles)
        .should
        .deep
        .include
        .members([newFile]);
    });
  });

  describe('SET_DETAIL', () => {
    const initialState = {
      userFiles: [
        {
          id: 1,
          name: 'Existing file'
        }, {
          id: 2,
          name: 'Another file'
        }
      ],
      detailedFile: {}
    };

    it('should set file from userFiles with given id as detailedFile', () => {
      const state = fileReducer(initialState, FileActions.setDetail(1));

      (state.detailedFile)
        .should
        .deep
        .equal(initialState.userFiles[0]);
    });

    it('should not modify userFiles', () => {
      const state = fileReducer(initialState, FileActions.setDetail(1));

      (state.userFiles)
        .should
        .deep
        .equal(initialState.userFiles);
    });

    it('should set detailedFile to {} if no file with id is found', () => {
      const state = fileReducer(initialState, FileActions.setDetail(1234567));

      (state.detailedFile).should.be.empty;
      (state.detailedFile).should.be.an('object');
    });

    it('should set detailedFile to {} if id is null', () => {
      const state = fileReducer(initialState, FileActions.setDetail(null));

      (state.detailedFile).should.be.empty;
      (state.detailedFile).should.be.an('object');
    });

    it('should set detailedFile to {} if id is empty', () => {
      const state = fileReducer(initialState, FileActions.setDetail());

      (state.detailedFile).should.be.empty;
      (state.detailedFile).should.be.an('object');
    });

     it('should set detailedFile to {} if id is undefined', () => {
      const state = fileReducer(initialState, FileActions.setDetail(undefined));

      (state.detailedFile).should.be.empty;
      (state.detailedFile).should.be.an('object');
    });
  });
});