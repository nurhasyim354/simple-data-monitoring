const express = require('express')
const MultiSensorTable = require('./repositories/models/multiSensor')
const Db = require('./repositories/db')
const dayJs = require('dayjs')
const config = require('../config.json')
const AuthService = require('./services/authService')

class Apis {
  router = express.Router({ strict: true })
  constructor() {
    this.dbConfig = config.db
    const db = new Db(this.dbConfig)
    const dbConn = db.getConnection()

    this.auth = new AuthService(dbConn)

    this.webConfig = config.web
    this.gwConfig = config.gateway
    this.receiverConfig = config.receiver

    this.multiSensorTable = new MultiSensorTable(dbConn)
    this.multiSensorTable.initTable()
    this.initRoutes()
  }

  initRoutes() {
    this.router.post('/api/login', async (req, res, next) => this.auth.handleApiLogin(req, res, next))
    this.router.get('/api/config', this.auth.authMiddleware(), async (req, res, next) => this.handleApiConfig(req, res, next))
    this.router.get('/api/multisensor', this.auth.authMiddleware(), (req, res, next) => this.handleApiMultiSensor(req, res, next))
    this.router.get('/api/ota', async (req, res, next) => this.handleApiOta(req, res, next))
  }

  async handleApiOta(req, res) {
    const { filter } = req.query

    const resDb = await this.multiSensorTable.distinct('IMEI', { IMEI: filter }, true);
    const imeiList = resDb.map(r => r.IMEI);

    res.json({
      data: imeiList
    });
  }

  async handleApiConfig(req, res) {
    res.json({
      db: config.db,
      gateway: config.gateway,
      receiver: config.receiver,
      app: config.app
    });
  }

  async handleApiMultiSensor(req, res) {
    const data = await this.multiSensorTable.getAll({}, { receiver_time: 'desc' })
    const dt = (data ?? []).map(dt => {
      return { ...dt, receiver_time: dayJs(dt.receiver_time).format('YYYY-MM-DD HH:mm:ss') }
    })
    res.json({
      data: dt
    })
  }
}

module.exports = Apis
