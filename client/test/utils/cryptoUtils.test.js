import * as chai from 'chai'
import fs from 'fs-promise'
import {encryptWithSymmetricKey, decryptWithSymmetricKey, generatePassword, encryptWithPublicKey, decryptWithPrivateKey} from '../../src/utils/cryptoUtils.js'

let expect = chai.expect
const password = 'd6F3Efeq';
const testFile = 'test/utils/test.txt';
const initialContent = 'Test file content';
const encryptedFile = testFile + '.enc';

describe('cryptoUtils', () => {

    describe('symmetric key encryption', () => {
        it('encrypted file is created', () => {
            return fs.writeFile(testFile, initialContent).then(function () {
                return encryptWithSymmetricKey(testFile, password);
            }).then(function (encryptedFile) {
                expect(fs.existsSync(encryptedFile)).to.be.ok;
                return fs.unlink(encryptedFile);
            }).then(function () {
                return fs.unlink(testFile);
            });
        })

        it('encrypted file is different from original', () => {
            return fs.writeFile(testFile, initialContent).then(function () {
                return encryptWithSymmetricKey(testFile, password);
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
                return encryptWithSymmetricKey(testFile, password);
            }).then(function (encryptedFile) {
                return decryptWithSymmetricKey(encryptedFile, password);
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
                return encryptWithSymmetricKey(testFile, password);
            }).then(function (encryptedFile) {
                return decryptWithSymmetricKey(encryptedFile, 'asd123');
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

    describe('private-pulbic key pair encryption', () => {
        it('encryption of text with public key and decryption with private returns same text', () => {
            const toEncrypt = 'Some example text.';
            return fs.readFile('test/utils/test_public_key.txt', 'utf8').then(function (publicKey) {
                return encryptWithPublicKey(toEncrypt, publicKey);
            }).then(function (encrypted) {
                return fs.readFile('test/utils/test_private_key.txt', 'utf8').then(function (privateKey) {
                    return decryptWithPrivateKey(encrypted, privateKey);
                }).then(function (decrypted) {
                    expect(decrypted).to.be.equal(toEncrypt);
                })
            })
        })
    })
})