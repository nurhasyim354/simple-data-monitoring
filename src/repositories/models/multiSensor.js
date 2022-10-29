const BaseModel = require('./baseModel')

class MultiSensor extends BaseModel {
  constructor (_dbConn) {
    super(_dbConn, 'multisensor_tbl', MultiSensor.schema)
  }

  // {"id":"2892","imei":"0090851","rssi":"-16","dummy":"0","voltage":"350","signal":"-80","sensor1":"258","sensor2":"325","sensor3":"150","sensor4":"012"}
  schema = {
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
      sensor4: { type: 'string', maxLength: 20, defaultValue: '' },
      receiver_time: { type: 'string', isDate: true }
    },
    required: [],
    additionalProperties: false
  }
}

module.exports = MultiSensor
