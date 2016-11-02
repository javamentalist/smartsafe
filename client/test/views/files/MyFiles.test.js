import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())

import { MyFiles, FileTable } from '../../../src/views/files'
import { Button } from '../../../src/views'


describe('MyFiles', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MyFiles />)
  });

  it('should render', () => {
    wrapper.should.be.present()
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