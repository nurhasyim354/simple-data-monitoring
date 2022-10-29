const BaseModel = require('./baseModel')

class Raw extends BaseModel {
  constructor (_dbConn) {
    super(_dbConn, 'raw_tbl')
  }

  schema = {
    type: 'object',
    properties: {
      uid: { type: 'integer', auto: true, isPk: true },
      timestamp: { type: 'string', isDate: true },
      raw: { type: 'string', maxLength: 1024, defaultValue: '' },
      decoded: { type: 'string', maxLength: 1024, defaultValue: '' },
      valid_checksum: { type: 'integer', defaultValue: 0 }
    },
    required: [],
    additionalProperties: false
  }
}

module.exports = Raw
