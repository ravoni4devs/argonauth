import axios from 'axios'

function getAxios (params) {
  const instance = axios.create(params)
  instance.defaults.headers.common['Content-Type'] = 'application/json'
  const baseUrl = params.baseURL || process.env.API_BASE_URL
  if (baseUrl) {
    instance.defaults.baseURL = baseUrl
  }
  instance.interceptors.response.use(
    (response) => {
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data;
    },
    (error) => {
      if (!error.response) {
        return Promise.reject({
          status: 0,
          error: error
        });
      }
      if (error.response.status === 401) {
        return Promise.reject({
          status: 401,
          error: new Error('401')
        });
      }
      if (error.response.data && error.response.data.error) {
        return Promise.reject({
          code: error.response.status,
          error: error.response.data.error
        });
      }
      return Promise.reject({
        status: 666,
        error: error
      });
    }
  )
  return instance
}

class HttpClient {
  constructor (params = {}) {
    this.params = params
    this.$axios = getAxios(params)
  }

  withToken (token) {
    if (!token) {
      return this.$axios
    }
    return this.withHeaders({'Authorization': `Bearer ${token}`})
  }

  withHeaders (headers) {
    const instance = getAxios(this.params)
    const { common } = instance.defaults.headers
    instance.defaults.headers.common = {
      ...common,
      ...headers
    }
    return instance
  }

  post(url, data, config) {
    return this.$axios.post(url, data, config)
  }

  put(url, data, config) {
    return this.$axios.put(url, data, config)
  }

  patch(url, data, config) {
    return this.$axios.patch(url, data, config)
  }

  get(url, config) {
    return this.$axios.get(url, config)
  }

  delete(url, config) {
    return this.$axios.delete(url, config)
  }

  options(url, config) {
    return this.$axios.options(url, config)
  }

  head(url, config) {
    return this.$axios.head(url, config)
  }
}

export default function (params) {
  return new HttpClient(params)
}
