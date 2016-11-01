/* eslint-disable */
require('testdom')('<html><body></body></html>')

import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import {MyFiles, FileTable, AddFileButton} from '../../../src/views/files'

import * as chai from 'chai'
chai.should()

describe('MyFiles', () => {

  it('should render', () => {
    const renderer = ReactTestUtils.createRenderer();
    const component = renderer.render(<MyFiles/>);
    (component.type)
      .should
      .equal('div')
  })

  it('should have first level title (h1) with text "Files"', () => {
    const component = ReactTestUtils.renderIntoDocument(<MyFiles/>);
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
    const component = ReactTestUtils.renderIntoDocument(<MyFiles/>);
    const fileTableArray = ReactTestUtils.scryRenderedComponentsWithType(component, FileTable);

    (fileTableArray)
      .should
      .have
      .lengthOf(1)
  })

  it('should have one AddFileButton', () => {
    const component = ReactTestUtils.renderIntoDocument(<MyFiles/>);
    const buttonArray = ReactTestUtils.scryRenderedComponentsWithType(component, AddFileButton);

    (buttonArray)
      .should
      .have
      .lengthOf(1)
  })

})