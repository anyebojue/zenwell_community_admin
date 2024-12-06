import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import configObj from 'configs'

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      // baseURL: configObj.baseURL,
      baseURL: 'https://community-admin.zenwell.cn', // 替换成你的实际接口地址
      timeout: configObj.requestTimeout, // 请求超时时间
      headers: { 'Content-Type': 'application/json' }
    })

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      config => {
        if (!config.url?.startsWith('/api')) {
          config.url = `/api${config.url}`
        }

        // 给GET和DELETE请求加时间戳
        if (config.method === 'get' || config.method === 'delete') {
          const timestamp = Date.now().toString() // 生成时间戳
          const urlObj = new URL(config.url!, this.instance.defaults.baseURL)
          const params = new URLSearchParams(urlObj.search)
          params.append('_t', timestamp)
          urlObj.search = params.toString()
          config.url = urlObj.toString()
        }

        // 只在未设置 Content-Type 时设置
        if (config.method === 'post' || config.method === 'patch') {
          if (!config.headers['Content-Type']) {
            // 自动根据 data 类型设置 Content-Type
            if (config.data instanceof FormData) {
              config.headers['Content-Type'] = 'multipart/form-data'
            } else {
              config.headers['Content-Type'] = 'application/json'
              config.data = JSON.stringify(config.data) // 确保 JSON 数据格式化
            }
          }
        }

        // 从 localStorage 或其他存储中获取 JWT
        const token = localStorage.getItem('zenwell_token')
        if (token && !config.url?.includes('/login')) {
          config.headers['Authorization'] = `Bearer ${token}` // 添加 Authorization 头 JWT
        }

        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response) {
          // 提取错误信息
          const errorData = error.response.data

          // 处理特定的状态码
          switch (error.response.status) {
            case 400:
              console.warn('请求错误，参数无效')
              break
            case 401:
              console.warn('未授权，请登录')
              localStorage.removeItem('zenwell_token')
              break
            case 403:
              console.warn('禁止访问')
              break
            case 404:
              console.warn('请求的资源未找到')
              break
            case 500:
              console.error('服务器内部错误')
              break
            default:
              console.warn('发生未知错误')
          }

          return Promise.reject({
            code: errorData.code || error.response.status, // 状态码
            message: errorData.message || '请求失败', // 错误信息
            reason: errorData.reason || '未知原因', // 可能的原因
            metadata: errorData.metadata || {}
          })
        } else {
          return Promise.reject({ message: '网络错误，请检查连接' }) // 网络错误
        }
      }
    )
  }

  // GET 请求
  public get<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(config.url!, config)
  }

  // POST 请求
  public post<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(config.url!, config.data, config)
  }

  // PATCH 请求
  public patch<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(config.url!, config.data, config)
  }

  // DELETE 请求
  public delete<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(config.url!, config)
  }
}

export const request = new Request()
