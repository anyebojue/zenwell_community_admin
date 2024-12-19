import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import configObj from 'configs'

class Request {
  private instance: AxiosInstance
  private delayMs: number = 200 // 统一的延迟时间，单位为毫秒
  private loadingTimeout: NodeJS.Timeout | null = null // 定义一个计时器

  constructor() {
    this.instance = axios.create({
      // baseURL: configObj.baseURL,
      baseURL: 'https://community-admin.zenwell.cn', // 替换成你的实际接口地址
      timeout: configObj.requestTimeout,
      headers: { 'Content-Type': 'application/json' }
    })

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      async config => {
        // 设置延时200毫秒的计时器
        this.loadingTimeout = setTimeout(() => {
          this.showLoadingAnimation()
        }, this.delayMs)

        // 保证所有请求路径都以 /api 开头
        if (!config.url?.startsWith('/api')) {
          config.url = `/api${config.url}`
        }

        // GET 和 DELETE 请求添加时间戳避免缓存
        if (config.method === 'get' || config.method === 'delete') {
          const timestamp = Date.now().toString()
          const separator = config.url.includes('?') ? '&' : '?'
          config.url = `${config.url}${separator}_t=${timestamp}`
        }

        // POST 和 PATCH 请求自动设置 Content-Type
        if (config.method === 'post' || config.method === 'patch') {
          if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] =
              config.data instanceof FormData ? 'multipart/form-data' : 'application/json'
            if (!(config.data instanceof FormData)) {
              config.data = JSON.stringify(config.data)
            }
          }
        }

        // 从 localStorage 获取 JWT token 并添加到请求头
        const token = localStorage.getItem('zenwell_token')
        if (token && !config.url.includes('/login')) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      response => {
        this.clearLoadingAnimation() // 清除加载动画
        return response
      },
      error => {
        this.clearLoadingAnimation() // 清除加载动画
        if (error.response) {
          const errorData = error.response.data
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
            code: errorData.code || error.response.status,
            message: errorData.message || '请求失败',
            reason: errorData.reason || '未知原因',
            metadata: errorData.metadata || {}
          })
        } else {
          return Promise.reject({ message: '网络错误，请检查连接' })
        }
      }
    )
  }

  // 显示加载动画的函数
  private showLoadingAnimation() {
    console.log('显示加载动画')
  }

  // 清除加载动画的函数
  private clearLoadingAnimation() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout)
      this.loadingTimeout = null
    }
    console.log('清除加载动画')
  }

  public get<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(config.url!, config)
  }

  public post<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(config.url!, config.data, config)
  }

  public patch<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(config.url!, config.data, config)
  }

  public delete<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(config.url!, config)
  }
}

export const request = new Request()
