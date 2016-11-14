import fileReducer from '../../src/reducers/fileReducer'
import * as FileActions from '../../src/actions/FileActions'

import * as chai from 'chai'
chai.should()

describe('fileReducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      userFiles: [],
      detailedFile: {},
      uploadQueue: []
    }
  });

  it('should return the initial state if no state is passed', () => {
    fileReducer(undefined, {}).should.deep.equal(initialState)
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

  describe('SET_DETAIL', () => {
    beforeEach(() => {
      initialState.userFiles = [
        {
          id: 1,
          name: 'Existing file'
        }, {
          id: 2,
          name: 'Another file'
        }
      ];
    });

    it('should set file from userFiles with given id as detailedFile', () => {
      const state = fileReducer(initialState, FileActions.setDetail(1));

      (state.detailedFile).should.deep.equal(initialState.userFiles[0]);
    });

    it('should not modify userFiles', () => {
      const state = fileReducer(initialState, FileActions.setDetail(1));

      (state.userFiles).should.deep.equal(initialState.userFiles);
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

  describe('ADD_FILE_TO_UPLOAD_QUEUE', () => {
    beforeEach(() => {
      initialState.uploadQueue = [
        {
          path: '/staryway/to/heaven'
        }
      ];
    });

    it('should add new file to existing ones in upload queue', () => {
      const newFile = {
        path: '/road/to/hell'
      };

      const state = fileReducer(initialState, FileActions.addFileToUploadQueue(newFile));

      (state.uploadQueue).should.have.lengthOf(initialState.uploadQueue.length + 1);
      // array should contain new file object
      (state.uploadQueue).should.deep.include.members([newFile]);
    });
  });

  describe('REMOVE_FILE_FROM_UPLOAD_QUEUE', () => {
    beforeEach(() => {
      initialState.uploadQueue = [
        {
          path: '/staryway/to/heaven'
        }, {
          path: '/road/to/hell'
        }
      ]
    });

    it('should remove file from upload queue at specified index', () => {
      const index = 0;
      const state = fileReducer(initialState, FileActions.removeFileFromUploadQueue(index));

      (state.uploadQueue).should.have.lengthOf(initialState.uploadQueue.length - 1);
      (state.uploadQueue).should.not.deep.include.members([initialState.uploadQueue[0]]);
    });

    it('should return upload queue unchanged if index was invalid', () => {
      const state = fileReducer(initialState, FileActions.removeFileFromUploadQueue(1000));

      (state.uploadQueue).should.deep.equal(initialState.uploadQueue);
    });
  });
});