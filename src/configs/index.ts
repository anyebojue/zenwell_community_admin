export default {
  baseURL: process.env.NODE_ENV === 'development' ? '' : window.location.origin,
  isDev: process.env.NODE_ENV === 'development',
  contentType: 'application/json;charset=UTF-8',
  requestTimeout: 50000
}
