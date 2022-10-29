/* eslint-disable no-undef */
const { handleMessage, start } = require('./app')
const Db = require('./repositories/db')
const WebSocketServer = require('ws').Server
const MultiSensorTable = require('./repositories/models/multiSensor')
const { post } = require('request')

jest.mock('request')
jest.mock('ws')
jest.mock('./repositories/db')
jest.mock('./web')
jest.mock('./repositories/models/multiSensor')

const mockExpressApp = {
  use: jest.fn(),
  listen: jest.fn(),
  set: jest.fn(),
  engine: jest.fn()
}

jest.mock('express', () => {
  const mockedExpress = () => {
    return mockExpressApp
  }
  Object.defineProperty(mockedExpress, 'static', { value: jest.fn() })
  return mockedExpress
})

describe('app', () => {
  const mockValidate = jest
    .spyOn(MultiSensorTable.prototype, 'validate')
  const mockInsertOne = jest
    .spyOn(MultiSensorTable.prototype, 'insertOne')
  const data = { id: '2892', imei: '0090851', rssi: '-16', dummy: '0', voltage: '350', signal: '-80', sensor1: '258', sensor2: '325', sensor3: '150', sensor4: '012' }
  const mockData = Buffer.from(JSON.stringify(data))
  const mockWs = {
    send: jest.fn()
  }
  const mockTable = new MultiSensorTable({});

  beforeEach(() => {
    mockValidate.mockImplementation(() => {
      return {
        valid: true
      }
    })
    mockInsertOne.mockImplementation(() => {
      return {
        id: 'newid'
      }
    })
    post.mockImplementation((option, callback) => {
      callback(null, {})
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('handleMessage should respond with a success message', async () => {
    await handleMessage(mockData, null, mockWs, mockTable)

    expect(MultiSensorTable).toHaveBeenCalledTimes(1)
    expect(mockValidate).toHaveBeenCalledTimes(1)
    expect(mockInsertOne).toHaveBeenCalledTimes(1)
    expect(post).toHaveBeenCalledTimes(1)
    expect(mockWs.send.mock.calls[0][0]).toBe('{"msgType":"success","msg":{"data":{"id":"newid"}}}')
  })

  test('handleMessage should respond with error message when the data is invalid', async () => {
    mockValidate.mockImplementation(() => {
      return {
        valid: false,
        errors: 'invalid data'
      }
    })

    await handleMessage(mockData, null, mockWs, mockTable)

    expect(mockWs.send.mock.calls[0][0]).toBe('{"msgType":"error","msg":{"error":"invalid data"}}')
  })

  test('handleMessage should respond with error message when failed to insert the data into DB', async () => {
    mockInsertOne.mockImplementation(() => {
      throw new Error('db error')
    })

    await handleMessage(mockData, null, mockWs, mockTable)

    expect(mockWs.send.mock.calls[0][0]).toBe('{"msgType":"error","msg":{"error":"db error"}}')
  })

  test('handleMessage should respond with error message when failed to post to gateway', async () => {
    post.mockImplementation((option, callback) => {
      callback({ message: 'error gateway' }, null)
    })

    await handleMessage(mockData, null, mockWs, mockTable)

    expect(mockWs.send.mock.calls[0][0]).toBe('{"msgType":"error","msg":{"error":"error gateway"}}')
  })

  test('start should start the receiver and serve the web', async () => {
    start()

    expect(mockExpressApp.listen).toHaveBeenCalledTimes(1)
    expect(WebSocketServer).toHaveBeenCalledTimes(1)
  })
})
