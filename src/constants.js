/* eslint-disable no-undef */
const path = require('path')

const WEB_DIR = path.resolve(__dirname, '..', 'web')
const STATIC_DIR = path.resolve(WEB_DIR, 'build', 'static')
const VIEWS_DIR = path.resolve(WEB_DIR, 'build')
const INDEX_PAGE = path.resolve(VIEWS_DIR, 'index.html')
// const TABLE_PAGE = path.resolve(VIEWS_DIR, 'table.html')
// const LOGIN_PAGE = path.resolve(VIEWS_DIR, 'login.html')
// const OTA_PAGE = path.resolve(VIEWS_DIR, 'ota.html')
// const NOT_FOUND_PAGE = path.resolve(VIEWS_DIR, '404.html')

module.exports = {
  WEB_DIR,
  STATIC_DIR,
  VIEWS_DIR,
  INDEX_PAGE
  // TABLE_PAGE,
  // LOGIN_PAGE,
  // OTA_PAGE,
  // NOT_FOUND_PAGE
}
