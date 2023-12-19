import axiosBase from 'axios'

import {parseCookies} from './common.utils'

const axios = axiosBase.create()
const prefix = 'server__'

/**
 *❗️IMPORTANT
 *
 * It's important to pass `withCredentials: true` to the axios instance,
 * otherwise http-only cookies won't be sent to the server.
 */

export async function createCookie(baseURL, cookie) {
  const dto = {
    ...cookie,
    name: prefix + cookie.name,
    expires: cookie.expires.toUTCString(),
  }
  try {
    await axios.post('/cookies', dto, {
      withCredentials: true,
      baseURL
    })
  } catch (error) {
    console.log(error)
  }
}

export async function removeLastCookie(baseURL, options) {
  try {
    await axios.delete('/cookies/last', {
      withCredentials: true,
      params: options,
      baseURL
    })
  } catch (error) {
    console.log(error)
  }
}

export async function removeAllCookies(baseURL, options) {
  try {
    await axios.delete('/cookies', {
      withCredentials: true,
      params: options,
      baseURL
    })
  } catch (error) {
    console.log(error)
  }
}

export async function getAllCookies(baseURL) {
  try {
    const response = await axios.get('/cookies', {
      withCredentials: true,
      baseURL
    })
    const cookies = response.data
    return parseCookies(cookies)
  } catch (error) {
    console.log(error)
  }
}
