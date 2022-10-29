const mysql = require('mysql')

class Db {
  constructor (config) {
    this.pool = mysql.createPool(config)
  }

  getConnection () {
    return this.pool
  }
}

module.exports = Db
