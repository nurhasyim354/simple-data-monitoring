/* eslint-disable no-undef */
const express = require('express')
const WebSocketServer = require('ws').Server
const bodyParser = require('body-parser')
const MultiSensorTable = require('./repositories/models/multiSensor')
const Db = require('./repositories/db')
const dayjs = require('dayjs')
const Apis = require('./Apis')
const { post } = require('request')
const config = require('../config.json')
const constants = require('./constants')
const { logger } = require('./utils')
const cors = require('cors');

const startWeb = () => {
  const app = express()
  const webConfig = config.web
  const port = process.env.PORT || webConfig.port || 8001

  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.static(constants.STATIC_DIR))
  app.use(express.static(constants.VIEWS_DIR))

  app.use('/', new Apis().router)

  app.use((req, res) => {
    res.sendFile(constants.INDEX_PAGE);
  });
  app.listen(port, webConfig.host)
  logger.info(`Web Server is listening on address: ${webConfig.host} port:${port}`)
}

const handleMessage = async (data, flags, ws, multiSensorTable) => {
  try {
    const json = JSON.parse(data.toString())
    const val = multiSensorTable.validate(json)
    if (!val.valid) {
      ws.send(JSON.stringify({ msgType: 'error', msg: { error: val.errors } }))
      return
    }

    const res = await multiSensorTable.insertOne({ ...json, receiver_time: dayjs().format('YYYY-MM-DD HH:mm:ss') })

    await sendToGateway(json)

    ws.send(JSON.stringify({ msgType: 'success', msg: { data: res } }))
  } catch (e) {
    ws.send(JSON.stringify({ msgType: 'error', msg: { error: e.message } }))
  }
}

const startReceiver = () => {
  const receiverConfig = config.receiver
  const port = process.env.PORT || receiverConfig.port

  const dbConfig = config.db
  const db = new Db(dbConfig)
  const dbConn = db.getConnection()

  const multiSensorTable = new MultiSensorTable(dbConn)
  multiSensorTable.initTable()

  const wss = new WebSocketServer({ host: receiverConfig.host, port })
  logger.info(`Receiver server is listening on address: ${receiverConfig.host} port:${port}`)
  wss.on('connection', (ws) => {
    ws.on('message', (data, flag) => handleMessage(data, flag, ws, multiSensorTable))
  })
}

const sendToGateway = async (data) => {
  const gatewayConfig = config.gateway
  const { protocol, host, port, path } = gatewayConfig
  logger.debug('Sending to gateway')

  return new Promise((resolve, reject) => {
    return post({
      url: `${protocol}://${host}:${port}/${path}`,
      json: true,
      body: data
    }, function (error, response) {
      if (error) {
        logger.error('Error sending data to gateway', { data, error })
        return reject(error)
      }
      resolve(response)
    })
  })
}

const start = () => {
  startWeb()
  startReceiver()
}

module.exports = {
  start,
  handleMessage
}
