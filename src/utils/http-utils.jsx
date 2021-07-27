import axios from 'axios'
import config from './config'

const _axios = axios.create({
  baseURL: config.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const axiosKakao = axios.create({ baseURL: config.KAKAO_OAUTH_URL })
export { _axios, axiosKakao }
