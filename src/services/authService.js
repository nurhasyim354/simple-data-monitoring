const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../repositories/models/userModel')
const Db = require('../repositories/db')
const config = require('../../config.json')
const { logger } = require('../utils')

class AuthService {
  constructor(_dbConn = null) {
    if (!_dbConn) {
      const db = new Db(config.db)
      this.user = new UserModel(db.getConnection())
    } else {
      this.user = new UserModel(_dbConn)
    }
  }

  authMiddleware() {
    return (req, res, next) => {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

      if (!req.query || !req.query.token) {
        res.status(401).json({ error: 'Invalid credential!', success: false })
        return
      }

      const { token } = req.query
      const decoded = jwt.decode(token)

      if (!decoded || decoded.data.ipAddress !== ip || decoded.exp < dayjs().unix()) {
        res.status(401).json({ error: 'Invalid credential!', success: false })
        return
      }

      next();
    }
  }

  async login(username, password, ipAddress) {
    const user = await this.user.findOne({ username })
    const response = {
      success: false,
      error: 'Invalid credentials!'
    }

    if (!user) {
      return response
    }

    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) {
      return response
    }

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * config.auth.expiryInMinutes),
      data: {
        scopes: ['monitoring'],
        ipAddress
      }
    }, config.auth.secret)

    return {
      success: true,
      data: {
        token
      }
    }
  }

  async authenticate(token, ipAddress) {
    const response = {
      success: false,
      error: 'Invalid credentials!'
    }
    try {
      const verified = jwt.verify(token, config.auth.secret)
      if (verified.ipAddress !== ipAddress) {
        return response
      }

      return {
        success: true,
        data: verified
      }
    } catch (e) {
      logger.error('Auth Error', { error: e })
      return response
    }
  }

  async upsertUser(params) {
    await this.user.initTable()

    const valResult = this.user.validate(params)
    if (!valResult.valid) {
      return { success: false, error: valResult.errors }
    }

    const { username, password, name } = params
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const existingUser = await this.user.findOne({ username: params.username })
    if (!existingUser) {
      const result = await this.user.insertOne({
        username,
        name,
        password: hash,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })

      logger.debug('Create user result:', { result })
      return {
        success: true,
        error: null,
        data: result
      }
    } else {
      const result = await this.user.updateOne({ username }, { password: hash, name })
      logger.debug('Update user result:', { result })
      return {
        success: true,
        error: null,
        data: result
      }
    }
  }

  async handleApiLogin(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const resLogin = await this.login(req.body.username, req.body.password, ip)

    if (!resLogin.success) {
      res.status(403).send(resLogin.error)
      return;
    }

    res.send(resLogin.data)
  }
}

module.exports = AuthService
