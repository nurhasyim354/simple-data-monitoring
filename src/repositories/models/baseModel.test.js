/* eslint-disable no-undef */
const BaseModel = require('./baseModel')

describe('BaseModel', () => {
    const mockDbConn = {
        query: jest.fn((query, callback) => callback(null, 'somedata'))
    }
    const mockSchema = {
        type: 'object',
        properties: {
            uid: { type: 'integer', auto: true, bigInt: true, isPk: true },
            id: { type: 'integer', bigInt: true, defaultValue: 0 },
            imei: { type: 'string', maxLength: 20, defaultValue: '', isKey: true },
            rssi: { type: 'integer', defaultValue: 0 },
            dummy: { type: 'integer', defaultValue: 0 },
            voltage: { type: 'integer', defaultValue: 0 },
            signal: { type: 'integer', defaultValue: 0 },
            sensor1: { type: 'string', maxLength: 20, defaultValue: '' },
            sensor2: { type: 'string', maxLength: 20, defaultValue: '' },
            sensor3: { type: 'string', maxLength: 20, defaultValue: '' },
            sensor4: { type: 'string' },
            receiver_time: { type: 'string', isDate: true }
        },
        required: [],
        additionalProperties: false
    }
    const mockValidData = { id: '2892', imei: '0090851', rssi: '-16', dummy: '0', voltage: '350', signal: '-80', sensor1: '258', sensor2: '325', sensor3: '150', sensor4: '012' }
    const table = new BaseModel(mockDbConn, 'new_tbl', mockSchema)


    afterEach(() => {
        jest.clearAllMocks()
    })

    test('Should init table if not exist', async () => {
        await table.initTable()

        expect(mockDbConn.query).toHaveBeenCalledTimes(1)
        expect(mockDbConn.query).toHaveBeenCalledWith("CREATE TABLE IF NOT exists test_new_tbl (`uid` bigint AUTO_INCREMENT, `id` bigint NOT NULL DEFAULT '0', `imei` varchar(20) NOT NULL DEFAULT '', `rssi` int NOT NULL DEFAULT '0', `dummy` int NOT NULL DEFAULT '0', `voltage` int NOT NULL DEFAULT '0', `signal` int NOT NULL DEFAULT '0', `sensor1` varchar(20) NOT NULL DEFAULT '', `sensor2` varchar(20) NOT NULL DEFAULT '', `sensor3` varchar(20) NOT NULL DEFAULT '', `sensor4` varchar(65535), `receiver_time` datetime, PRIMARY KEY (`uid`), KEY `test_new_tbl_imei` (`imei`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;", expect.anything())
    })

    test('getAll', async () => {
        const res = await table.getAll()

        expect(mockDbConn.query).toHaveBeenCalledTimes(1)
        expect(mockDbConn.query.mock.calls[0][0]).toBe('SELECT * FROM test_new_tbl ')
        expect(res).toBe('somedata')
    })

    test('getAll should support filter, sorting, and limit', async () => {
        const res = await table.getAll({ id: 0 }, { receiver_time: 'desc' }, 1)

        expect(mockDbConn.query).toHaveBeenCalledTimes(1)
        expect(mockDbConn.query.mock.calls[0][0]).toBe('SELECT * FROM test_new_tbl WHERE id=0 ORDER BY receiver_time desc LIMIT 1')
        expect(res).toBe('somedata')
    })

    test('Should insert a data', async () => {
        const mockDbConn = {
            query: jest.fn((query, data, callback) => callback(null, 'somedata'))
        }

        const res = await new BaseModel(mockDbConn, 'new_tbl', mockSchema).insertOne(mockValidData)

        expect(mockDbConn.query).toHaveBeenCalledTimes(1)
        expect(mockDbConn.query.mock.calls[0][0]).toBe('INSERT INTO test_new_tbl SET ?')
        expect(mockDbConn.query.mock.calls[0][1]).toBe(mockValidData)
        expect(res).toBe('somedata')
    })

    test('Should log error of failed insert data', async () => {
        const mockDbConnError = {
            query: jest.fn((query, data, callback) => callback('some errors', null))
        }

        try {
            await new BaseModel(mockDbConnError, 'new_tbl', mockSchema).insertOne(mockValidData)
        } catch (e) {
            expect(e).toEqual('some errors')
            expect(mockDbConnError.query).toHaveBeenCalledTimes(1)
        }
    })

    test('Should log database error', async () => {
        const mockDbConnError = {
            query: jest.fn((query, callback) => callback('some errors', null))
        }

        try {
            await new BaseModel(mockDbConnError, 'new_tbl', mockSchema).initTable()
        } catch (e) {
            expect(e).toEqual('some errors')
            expect(mockDbConnError.query).toHaveBeenCalledTimes(1)
        }
    })
})
