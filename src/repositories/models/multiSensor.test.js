/* eslint-disable no-undef */
const MultiSensor = require('./multiSensor')

describe('Multisensor', () => {
  const mockDbConn = {
    query: jest.fn((query, callback) => callback(null, 'somedata'))
  }
  const mockValidData = { id: '2892', imei: '0090851', rssi: '-16', dummy: '0', voltage: '350', signal: '-80', sensor1: '258', sensor2: '325', sensor3: '150', sensor4: '012' }
  const table = new MultiSensor(mockDbConn)

  afterEach(() => {
    jest.clearAllMocks()
  })

  
  test('Should validate data', async () => {
    const res = await table.validate(mockValidData)

    expect(res.valid).toBe(true)
    expect(res.errors).toBe(null)
  })

  test('Should return indicator and error for invalidate data', async () => {
    const mockInvalidData = { ...mockValidData, unknownAttribute: 'unknown value' }
    const res = await table.validate(mockInvalidData)

    expect(res.valid).toBe(false)
    expect(res.errors).toEqual([{ instancePath: '', keyword: 'additionalProperties', message: 'must NOT have additional properties', params: { additionalProperty: 'unknownAttribute' }, schemaPath: '#/additionalProperties' }])
  })
})
