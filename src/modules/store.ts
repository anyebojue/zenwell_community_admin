import { configureStore } from '@reduxjs/toolkit'
import info from './global'
import CommunitySlice from './community'
import PropertyCompanySlice from './propertyCompany'

const store = configureStore({
  reducer: {
    info,
    CommunitySlice,
    PropertyCompanySlice
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
