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

  it('should have one first level title (h1) with text "Files"', () => {
    wrapper.should.

      h1Array
      .should
      .have
      .lengthOf(1)

    const h1 = h1Array[0];

    (h1.innerHTML)
      .should
      .equal('Files')
  })

  it('should have a FileTable', () => {
    wrapper.should.have.descendants(FileTable)
  })

  it('should have one Button with onClick prop', () => {
    wrapper.should.have.descendants(Button)
  })
})