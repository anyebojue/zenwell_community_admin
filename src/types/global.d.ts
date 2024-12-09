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
  }
  interface Error {
    code?: number // 可选的错误码
    message: string // 错误信息
    reason?: string // 错误原因
    metadata?: unknown // 额外的元数据
  }
}
