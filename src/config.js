const host = 'http://localhost'
const vers = '/v1/'
const port = 8080

const config = {
  url: {
    init: host + ':' + port + vers + 'init/',
    signup: host + ':' + port + vers + 'user/signup',
    login: host + ':' + port + vers + 'user/login',
  }
}

export default config
