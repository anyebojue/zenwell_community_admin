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
        let params = config.params || {}

        // 设置延时200毫秒的计时器
        this.loadingTimeout = setTimeout(() => {
          this.showLoadingAnimation()
        }, this.delayMs)

        // 保证所有请求路径都以 /api 开头
        if (!config.url?.startsWith('/api')) {
          config.url = `/api${config.url}`
        }

        // 去重 config.params，避免重复的参数
        const uniqueParams: Record<string, string | number | boolean> = {}

        // 遍历参数，去重
        for (const [key, value] of Object.entries(params)) {
          if (key !== '_t') {
            // 如果值是数组，保留第一个值，或者直接保持原值
            if (Array.isArray(value)) {
              uniqueParams[key] = value[0] // 如果是数组，只取第一个
            } else {
              uniqueParams[key] = value as string | number | boolean // 直接保持原值
            }
          }
        }

        // GET 和 DELETE 请求添加时间戳避免缓存
        if (config.method === 'get' || config.method === 'delete') {
          const timestamp = Date.now().toString()
          const separator = config.url.includes('?') ? '&' : '?' // 判断是否已存在查询字符串

          // 获取基础 URL 部分（清除现有的查询参数）
          const baseUrl = config.url.split('?')[0]

          // 手动构建查询字符串
          let queryParams = []

          // 获取 communityId 和 userId 等其他参数
          const current_community = localStorage.getItem('current_community')
          if (!config.url.includes('/info') && current_community) {
            const community = JSON.parse(current_community)
            queryParams.push(`communityId=${community.id}`)
          }

          // 仅保留去重后的 params 中的必要参数（排除 _t）
          for (const [key, value] of Object.entries(uniqueParams)) {
            queryParams.push(`${key}=${encodeURIComponent(value)}`)
          }

          // 添加时间戳（_t）参数
          queryParams.push(`_t=${timestamp}`)

          // 拼接新的 URL 和查询字符串
          config.url = `${baseUrl}${separator}${queryParams.join('&')}`

          // 清空 params，以免 axios 自动处理重复的 params
          config.params = {}
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
        // if (token && !config.url.includes('/login')) {
        config.headers['Authorization'] = `Bearer ${token}`
        // }

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
