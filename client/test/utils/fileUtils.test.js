import * as chai from 'chai'
import fs from 'fs-promise'
import {createHashForFile} from '../../src/utils/fileUtils.js'

let expect = chai.expect

const testFile = 'test/utils/test.txt';

describe('File utils', () => {

    describe('File hash', () => {
        it('should return expected hash', () => {
            return fs.writeFile(testFile, "Test file content").then(function () {
                const readStream = fs.createReadStream(testFile);
                return createHashForFile(readStream)
            }).then(function (fileHash) {
                const expectedHash = '6c76f7bd4b84eb68c26d2e8f48ea76f90b9bdf8836e27235a0ca4325f8fe4ce5';
                expect(fileHash).to.equal(expectedHash);
                return fs.unlink(testFile);
            });
        })
    })
})