/* eslint-disable no-undef */
const Web = require('./web')
const MultiSensorTable = require('./repositories/models/multiSensor')
const AuthService = require('./services/authService')
const Db = require('./repositories/db')

jest.mock('./repositories/db')
jest.mock('./repositories/models/multiSensor')
jest.mock('./services/authService')

const mockGet = jest.fn()
const mockPost = jest.fn()
jest.mock('express', () => {
  const mockedExpress = () => {
    return {}
  }
  Object.defineProperty(mockedExpress, 'Router', {
    value: () => {
      return {
        get: mockGet,
        post: mockPost,
      }
    }
  })
  return mockedExpress
})

describe('Web', () => {
  const mockRequest = {
    path: 'path',
    query: {
      pause: false
    },
    body: {
      username: 'test1',
      password: 'pass'
    },
    headers: {
      'x-forwarded-for': '1.1.1.1'
    }
  }
  const mockRespose = {
    send: jest.fn(),
    status: (code) => {
      return mockRespose
    }
  }

  const mockGetAll = jest.spyOn(MultiSensorTable.prototype, 'getAll')
  const mockLogin = jest.spyOn(AuthService.prototype, 'login')

  const mockAuth = new AuthService({})

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('constructor should initialize table and initialize the routes', () => {
    // eslint-disable-next-line no-new
    new Web({})

    expect(Db).toHaveBeenCalledTimes(1)
    expect(Db.prototype.getConnection).toHaveBeenCalledTimes(1)
    expect(MultiSensorTable.prototype.initTable).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenNthCalledWith(1, '/', mockAuth.authMiddleware(), expect.anything())
    expect(mockGet).toHaveBeenNthCalledWith(2, '/multisensor', mockAuth.authMiddleware(), expect.anything())
    expect(mockGet).toHaveBeenNthCalledWith(3, '/login', expect.anything())
    expect(mockPost).toHaveBeenNthCalledWith(1, '/api/login', expect.anything())
    expect(mockGet).toHaveBeenNthCalledWith(4, '*', expect.anything())
  })

  test('handleMultiSensor should return templated multiSensor data', async () => {
    mockGetAll.mockImplementation(() => {
      return [{ id: 1, receiver_time: new Date() }]
    })
    const web = new Web()
    await web.handleMultiSensor(mockRequest, mockRespose)

    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockRespose.send).toHaveBeenCalledTimes(1)
  })

  test('handleMultiSensor should return templated empty multiSensor data', async () => {
    mockGetAll.mockImplementation(() => {
      return null
    })
    const web = new Web()
    await web.handleMultiSensor(mockRequest, mockRespose)

    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockRespose.send).toHaveBeenCalledTimes(1)
  })

  test('handleIndex should return templated index page', async () => {
    const web = new Web()
    await web.handleIndex(mockRequest, mockRespose)

    expect(mockRespose.send).toHaveBeenCalledTimes(1)
  })

  test('handleUILogin should return templated login page', async () => {
    const web = new Web()
    await web.handleUILogin(mockRequest, mockRespose)

    expect(mockRespose.send).toHaveBeenCalledTimes(1)
  })

  test('handleApiLogin should send token data', async () => {
    mockLogin.mockImplementation(() => {
      return {
        success: true,
        data: {
          token: 'authtoken'
        }
      }
    })
    const web = new Web()

    await web.handleApiLogin(mockRequest, mockRespose)

    expect(mockRespose.send).toHaveBeenNthCalledWith(1, { token: 'authtoken' })
  })

  // test('handleApiLogin should send 403 status and auth error data', async () => {
  //   mockLogin.mockImplementation(() => {
  //     return {
  //       success: false,
  //       data: {
  //         error: 'Invalid credential'
  //       }
  //     }
  //   })
  //   const web = new Web()

  //   await web.handleApiLogin(mockRequest, mockRespose)

  //   expect(mockRespose.send).toHaveBeenNthCalledWith(1, 403)
  // })

  test('handleNotFound should return templated 404 page', async () => {
    const web = new Web()
    await web.handleNotFound(mockRequest, mockRespose)

    expect(mockRespose.send).toHaveBeenCalledTimes(1)
    expect(mockRespose.send.mock.calls[0][0].search('Sorry, the requested page or resources could not be found') > -1).toBe(true)
  })
})
