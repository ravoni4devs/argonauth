import Cryptus from '@ravoni4devs/libcryptus'

import useStorage from '@/drivers/storage.js'
import useIndexdb from '@/drivers/indexdb.js'
import useHttpClient from '@/drivers/httpClient.js'

const key = 'user_id'

class Controller {
  constructor ({ httpClient, indexdb, storage, endpoints }) {
    this.$db = indexdb
    this.$httpClient = httpClient
    this.$storage = storage
    this.$cryptus = new Cryptus()
    this.$endpoints = endpoints
  }

  async preLogin (email) {
    const url = this.$endpoints.preLogin
    return await this.$httpClient.post(url, { email })
  }

  async login (user) {
    const hash = await this.$cryptus.pbkdf2({
      plainText: user.rawPassword,
      salt: user.salt,
      length: 256
    })
    const req = {
      id: user.id,
      email: user.email,
      password: hash
    }
    const url = this.$endpoints.login
    const saved = await this.$httpClient.post(url, req)
    await this.$db.set(saved)
    await this.$storage.set(key, saved.id)
    return saved
  }

  async getCurrentAccount () {
    const id = await  this.$storage.get(key)
    return await this.$db.getById(id)
  }

  async getToken () {
    const account = await this.getCurrentAccount()
    return account.token || ''
  }

  async whoami () {
    const url = this.$endpoints.whoami
    return await this.$httpClient.withToken().get(url)
  }

  async logout () {
    const account = await this.getCurrentAccount()
    const url = this.$endpoints.logout
    await this.$httpClient.withToken(account.token).delete(url)
    // const id = await this.$storage.getUserId()
    await this.$db.removeById(account.id)
  }
}

export default function ({ dbName='argonauth', baseURL='', endpoints={} } = {}) {
  const storage = useStorage()
  const indexdb = useIndexdb({ name: dbName, table: 'argonauth' })
  const httpClient = useHttpClient({ baseURL, withCredentials: true })
  return new Controller({ storage, indexdb, httpClient, endpoints })
}
