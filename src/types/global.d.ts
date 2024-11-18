import store from 'modules/store'

declare module '*.less' {
  const classes: { [key: string]: string }
  export default classes
}

declare global {
  type RootState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
  interface PaginationParams {
    'page.num'?: number
    'page.size'?: number
  }
  interface Error {
    code?: number // 可选的错误码
    message: string // 错误信息
    reason?: string // 错误原因
    metadata?: any // 额外的元数据
  }
}
