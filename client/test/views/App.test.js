import 'jsdom-global/register'
import React from 'react'
import { shallow, mount } from 'enzyme'

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())

import { App, Sidebar } from '../../src/views'

describe('<App />', () => {

  let wrapper

  beforeEach(() => {
    wrapper = shallow(<App/>);
  });

  it('should render', () => {
    wrapper.should.be.present();
    wrapper.should.have.descendants('div');
  })

  it('should contain sidebar', () => {
    const mounterWrapper = mount(<App/>)
    mounterWrapper.should.have.descendants(Sidebar);
    mounterWrapper.find(Sidebar).should.not.be.empty;
  })

})