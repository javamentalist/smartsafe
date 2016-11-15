import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())

import mockery from 'mockery'

import { UserFileListUndecorated, FileTable } from '../../../src/views/files'
import { Button } from '../../../src/views'

describe('<UserFileList />', () => {
  let wrapper

  before(() => {
    mockery.enable({
      useCleanCache: true
    });
    let electronMock = {
      // remote: {

      getGlobal: function(globalName) { /* your mock code */
        let global = {}
        if (globalName == 'winston') {
          global.log = function(type, str, ...opt) {
            return str; //console.log(str, ...opt);
          }
        }
      },
      dialog: {
        openFileDialog: function(options, cb) {
          return cb();
        }
      }
    // }
    };
    mockery.registerMock('electron/remote', electronMock);

  });

  beforeEach(() => {
    // Pass files as empty array, because we don't access it and don't care about
    // its' contents
    wrapper = shallow(<UserFileListUndecorated files={ [] } />)
  });

  it('should render', () => {
    wrapper.should.be.present();
    wrapper.should.have.descendants('div')
  })

  it('should have one first level title (h1)', () => {
    wrapper.should.have.exactly(1).descendants('h1')
  })

  it('should have title with text "Files"', () => {
    (wrapper.find('h1').first()).should.have.text('Files')
  });

  it('should have a FileTable', () => {
    wrapper.should.have.descendants(FileTable)
  })

  it('should have one Button with onClick prop', () => {
    wrapper.should.have.descendants(Button)
  })
})