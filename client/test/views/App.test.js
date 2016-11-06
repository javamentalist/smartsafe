import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())

import { App, Sidebar } from '../../src/views'


describe('<App />', () => {

  let wrapper

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should render', () => {
    wrapper.should.be.present()
    wrapper.should.have.descendants('div')
  })

  it('should have element with class .pane', () => {
    wrapper.should.have.descendants('.pane')
  });

  it('should contain sidebar', () => {
    wrapper.should.have.descendants(Sidebar)
  })

})