const BaseModel = require('./baseModel')

class UserModel extends BaseModel {
  constructor (_dbConn) {
    super(_dbConn, 'user_tbl')
  }

  schema = {
    type: 'object',
    properties: {
      uid: { type: 'integer', auto: true, bigInt: true, isPk: true },
      username: { type: 'string', maxLength: 50, defaultValue: '' },
      password: { type: 'string', maxLength: 1024, defaultValue: '' },
      name: { type: 'string', maxLength: 100, defaultValue: '' },
      createdAt: { type: 'string', isDate: true }
    },
    required: ['username', 'password'],
    additionalProperties: false
  }
}

module.exports = UserModel
