import { configureStore } from '@reduxjs/toolkit'
import globalStateReducer from './global'

const store = configureStore({
  reducer: {
    global: globalStateReducer
  },
  // 关闭序列化检测
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
