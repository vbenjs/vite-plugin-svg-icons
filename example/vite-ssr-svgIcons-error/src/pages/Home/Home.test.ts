import { mount } from '@vue/test-utils'
import Home from './Home.vue'

describe('Home', () => {

  it('should render title correctly', () => {
    const msg = 'Home'
    const wrapper = mount(Home, { props: { msg } })

    expect(wrapper.find('h1').text()).toEqual(msg)
  })
})
