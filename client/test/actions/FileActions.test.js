import * as actions from '../../src/actions/FileActions';

import * as chai from 'chai';
chai.should();

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
        };

        const action = actions.setDetail(id);

        action.should.deep.equal(expectedAction);

    });

    it('should create an action to add a file to upload queue', () => {
        const file = {
            path: '/path/to/file'
        };
        const expectedAction = {
            type: actions.ADD_FILE_TO_UPLOAD_QUEUE,
            payload: file
        };

        const action = actions.addFileToUploadQueue(file);

        action.should.deep.equal(expectedAction);
    });

    it('should create an action to remove file from upload queue', () => {
        const file = {
            path: '/path/to/file'
        };
        const expectedAction = {
            type: actions.REMOVE_FILE_FROM_UPLOAD_QUEUE,
            payload: file
        };

        const action = actions.removeFileFromUploadQueue(file);

        action.should.deep.equal(expectedAction);
    });

    it('should create action to start file upload', () => {
        const file = {
            path: '/path/to/file'
        };
        const expectedAction = {
            type: actions.START_UPLOAD,
            payload: file
        };

        const action = actions.setStartUpload(file);

        action.should.deep.equal(expectedAction);
    });

    it('should create action to set upload as finished', () => {
        const file = {
            path: '/path/to/file'
        };
        const expectedAction = {
            type: actions.UPLOAD_FINISHED,
            payload: file
        };

        const action = actions.setUploadFinished(file);

        action.should.deep.equal(expectedAction);
    });

    it('should create action to set file status', () => {
        const file = {
            path: '/path/to/file',
            eth: {
                hash: 'sdkkdkkdkd',
                link: 'link'
            }
        };
        const status = 'protected';
        const expectedAction = {
            type: actions.SET_FILE_STATUS,
            payload: {
                file: file,
                status: status
            }
        };

        const action = actions.setFileStatus(file, status);

        action.should.deep.equal(expectedAction);
    });
})