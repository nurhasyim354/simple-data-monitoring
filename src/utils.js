const DayJs = require('dayjs')
const config = require('../config.json')

class logger {
  static info (message, params) {
    if (['debug', 'info'].some(l => l === config.app.logLevel)) {
      console.log(`${DayJs().format('YYYY-MM-DD HH:mm:ss.SSS')} (info): ${message}`, params || '')
    }
  }

  static debug (message, params) {
    if (['debug'].some(l => l === config.app.logLevel)) {
      console.log(`${DayJs().format('YYYY-MM-DD HH:mm:ss.SSS')} (debug): ${message}`, params || '')
    }
  }

  static error (message, params) {
    console.log(`${DayJs().format('YYYY-MM-DD HH:mm:ss.SSS')} (error): ${message}`, params || '')
  }
}

module.exports = {
  logger
}
