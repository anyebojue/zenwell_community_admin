import store from 'modules/store'

declare module '*.less' {
  const classes: { [key: string]: string }
  export default classes
}

declare global {
  type RootState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
  interface PaginationParams {
    'page.num'?: string
    'page.size'?: string
    'page.disable'?: boolean
  }
  interface Error {
    code?: number // 可选的错误码
    message: string // 错误信息
    reason?: string // 错误原因
    metadata?: unknown // 额外的元数据
  }

  interface PayloadActionWithError<T> {
    type: string
    meta: {
      arg: T // 请求的参数类型
      requestId: string
      rejectedWithValue: boolean
      requestStatus: 'rejected' | 'fulfilled' // 请求的状态
      aborted: boolean
      condition: boolean
    }
    error?: {
      // 只有在 rejected 时才有 error 属性
      message: string
    }
  }
}
