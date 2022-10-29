const mysql = require('mysql')
const Ajv = require('ajv')
const { db } = require('../../../config.json')
const { logger } = require('../../utils')

class BaseModel {
  constructor(_dbConn, _tableName, _schema) {
    this.connection = _dbConn
    this.tableName = `${db.table_prefix}_${_tableName}`
    this.schema = _schema
    this.ajv = new Ajv({ strict: false, coerceTypes: true })
  }

  async initTable() {
    logger.debug(`Initializing table ${this.tableName}`)
    const columns = []
    const keys = []
    const { properties } = this.schema
    Object.keys(properties).forEach(key => {
      columns.push(`\`${key}\` ${this._getType(properties[key])}`)
      if (properties[key].isPk) {
        keys.push(`PRIMARY KEY (\`${key}\`)`)
      }
      if (properties[key].isKey) {
        keys.push(`KEY \`${this.tableName}_${key}\` (\`${key}\`)`)
      }
    })

    const query = `CREATE TABLE IF NOT exists ${this.tableName} (${(columns.concat(keys)).join(', ')} ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`
    return this._queryPromise(query)
  }

  _getType(prop) {
    const { type, auto, defaultValue, maxLength, isDate, bigInt } = prop
    switch (type.toLowerCase()) {
      case 'integer': return (bigInt ? 'bigint' : 'int') + (auto ? ' AUTO_INCREMENT' : '') + (defaultValue !== null && defaultValue !== undefined ? ` NOT NULL DEFAULT '${defaultValue}'` : '')
      case 'string': return (isDate ? 'datetime' : (maxLength ? `varchar(${maxLength})` : 'varchar(65535)')) + (defaultValue !== null && defaultValue !== undefined ? ` NOT NULL DEFAULT '${defaultValue}'` : '')
    }
  }

  _queryPromise(query, data = null) {
    return new Promise((resolve, reject) => {
      return data
        ? this.connection.query(query, data, (error, rows) => { // insert or update
          if (error) {
            return reject(error)
          }
          resolve(rows)
        })
        : this.connection.query(query, (error, rows) => { // query
          if (error) {
            return reject(error)
          }
          resolve(rows)
        })
    })
  }

  async getAll(filter = {}, sort = {}, limit = undefined) {
    logger.debug(`Querying table ${this.tableName}`)

    const sortArray = []
    Object.keys(sort).forEach((key) => {
      sortArray.push(`${key} ${sort[key]}`)
    })

    let query = `SELECT * FROM ${this.tableName} ${this._buildFilterString(filter)}`
    if (sortArray.length > 0) {
      query = `${query} ORDER BY ${sortArray.join(', ')}`
    }

    if (limit) {
      query = `${query} LIMIT ${limit}`
    }

    return this._queryPromise(query)
  }

  _buildFilterString(filter) {
    const filterArray = []
    Object.keys(filter).forEach((key) => {
      filterArray.push(`${key}=${mysql.escape(filter[key])}`)
    })
    const whereClause = filterArray.length > 0 ? `WHERE ${filterArray.join(' AND ')}` : ''
    return whereClause
  }

  _buildSearchString(filter) {
    const filterArray = []
    Object.keys(filter).forEach((key) => {
      filterArray.push(`${key} like '%${filter[key]}%'`)
    })
    const whereClause = filterArray.length > 0 ? `WHERE ${filterArray.join(' OR ')}` : ''
    return whereClause
  }

  async insertOne(data) {
    logger.debug(`Inserting data into table ${this.tableName}`)
    const query = `INSERT INTO ${this.tableName} SET ?`
    return this._queryPromise(query, data)
  }

  async updateOne(filter, data) {
    const query = `UPDATE ${this.tableName} SET ? ${this._buildFilterString(filter)}`
    return this._queryPromise(query, data)
  }

  async findOne(filter) {
    const res = await this.getAll(filter, {}, 1)
    return res.length > 0 ? res[0] : null
  }

  async distinct(column, filter = {}, search = false) {
    let query = `SELECT DISTINCT(${column}) FROM ${this.tableName} ${ search? this._buildSearchString(filter) : this._buildFilterString(filter)}`
    logger.debug(`Distinct`, { query });
    const res = await this._queryPromise(query)
    return res;
  }

  validate(data) {
    const valid = this.ajv.validate(this.schema, data)
    if (!valid) {
      logger.error('Error validating data to schema ', { data, schema: this.schema, error: this.ajv.errors })
    }
    return {
      valid,
      errors: this.ajv.errors
    }
  }
}

module.exports = BaseModel
