/* eslint-disable no-undef */
const Db = require('./db')
const mysql = require('mysql')

jest.mock('mysql')

describe('Db', () => {
  const mockDbPool = {
    end: jest.fn()
  }
  mysql.createPool.mockImplementation(() => {
    return mockDbPool
  })

  test('constructor should create mysql connection pool', () => {
    // eslint-disable-next-line no-new
    new Db({})

    expect(mysql.createPool).toHaveBeenCalledTimes(1)
  })

  test('getConnection should return db pool', () => {
    const db = new Db({})
    const pool = db.getConnection()

    expect(pool).toBe(mockDbPool)
  })
})
