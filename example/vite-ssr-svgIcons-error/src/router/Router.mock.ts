class MockRouter {

  push = jest.fn()

  replace = jest.fn()

  resolve = jest.fn();

}

export default new MockRouter()
