import * as chai from 'chai'
import fs from 'fs-promise'
import {encrypt, decrypt, generatePassword} from '../../src/utils/cryptoUtils.js'

let expect = chai.expect
const password = 'd6F3Efeq';
const testFile = 'test/utils/test.txt';
const initialContent = 'Test file content';
const encryptedFile = testFile + '.enc';

describe('Crypto utils', () => {

    it('encrypted file is created', () => {
        return fs.writeFile(testFile, initialContent).then(function () {
            return encrypt(testFile, password);
        }).then(function (encryptedFile) {
            expect(fs.existsSync(encryptedFile)).to.be.ok;
            return fs.unlink(encryptedFile);
        }).then(function () {
            return fs.unlink(testFile);
        });
    })

    it('encrypted file is different from original', () => {
        return fs.writeFile(testFile, initialContent).then(function () {
            return encrypt(testFile, password);
        }).then(function (encryptedFile) {
            return fs.readFile(encryptedFile, 'utf8');
        }).then(function (encrypted) {
            expect(encrypted).to.not.equal(initialContent);
            return fs.unlink(encryptedFile);
        }).then(function () {
            return fs.unlink(testFile);
        });
    })

    it('decryption with same key returns same file', () => {
        return fs.writeFile(testFile, initialContent).then(function () {
            return encrypt(testFile, password);
        }).then(function (encryptedFile) {
            return decrypt(encryptedFile, password);
        }).then(function (decryptedFile) {
            return fs.readFile(decryptedFile, 'utf8');
        }).then(function (decryptedContent) {
            expect(decryptedContent).to.be.equal(initialContent);
            return fs.unlink(encryptedFile);
        }).then(function () {
            return fs.unlink(testFile);
        });
    })

    it('decryption with different key doesn\'t return same file', () => {
        return fs.writeFile(testFile, initialContent).then(function () {
            return encrypt(testFile, password);
        }).then(function (encryptedFile) {
            return decrypt(encryptedFile, 'asd123');
        }).then(function (decryptedFile) {
            return fs.readFile(decryptedFile, 'utf8');
        }).then(function (decryptedContent) {
            expect(decryptedContent).to.not.equal(initialContent);
            return fs.unlink(encryptedFile);
        }).then(function () {
            return fs.unlink(testFile);
        });
    })
})