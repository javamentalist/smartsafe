require('testdom')('<html><body></body></html>')

import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import Files from '../../../src/views/files'
import FileTable from '../../../src/views/files/components/file-table'
import AddFileButton from '../../../src/views/files/components/add-file-button'

import * as chai from 'chai'
chai.should()

describe('Files', () => {

  it('should render', () => {
    const renderer = ReactTestUtils.createRenderer();
    const component = renderer.render(<Files/>);
    (component.type)
      .should
      .equal('div')
  })

  it('should have first level title (h1) with text "Files"', () => {
    const component = ReactTestUtils.renderIntoDocument(<Files/>);
    const h1Array = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'h1');

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
    const component = ReactTestUtils.renderIntoDocument(<Files/>);
    const fileTableArray = ReactTestUtils.scryRenderedComponentsWithType(component, FileTable);

    (fileTableArray)
      .should
      .have
      .lengthOf(1)
  })

  it('should have one AddFileButton', () => {
    const component = ReactTestUtils.renderIntoDocument(<Files/>);
    const buttonArray = ReactTestUtils.scryRenderedComponentsWithType(component, AddFileButton);

    (buttonArray)
      .should
      .have
      .lengthOf(1)
  })

})