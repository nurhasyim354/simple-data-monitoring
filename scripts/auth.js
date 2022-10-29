/* eslint-disable no-undef */
const { logger } = require('../src/utils')
const AuthService = require('../src/services/authService')

async function main (argv) {
  const params = {}
  argv.slice(2).forEach(p => {
    const param = p.split('=')
    Object.assign(params, { [param[0]]: param[1] })
  })

  if (!params.action || !params.username || !params.password) {
    logger.error('Missing action params. Please run: node auth.js action=upsert_user username=testuser1 password=password name=\'test user\'')
    return
  }

  const auth = new AuthService()
  switch (params.action) {
    case 'upsert_user': {
      logger.info('upserting user')

      const { username, name, password } = params
      const result = await auth.upsertUser({ username, name, password })
      if (!result.success) {
        logger.error('Upsert user failed.', { error: result.error })
        return
      }
      logger.info('Upsert user successful')
      break
    }
    default: {
      logger.info('Unknown action')
    }
  }
  process.exit(1)
}

main(process.argv)
