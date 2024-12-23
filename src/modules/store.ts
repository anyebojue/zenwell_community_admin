import { configureStore } from '@reduxjs/toolkit'
import info from './global'
import MenuSlice from './develop/menu'
import CommunitySlice from './platform/community'
import PropertyCompanySlice from './platform/propertyCompany'
import OrganizationInfoSlice from './platform/organizationInfo'
import EmployeesSlice from './platform/employees'
import RolesSlice from './platform/roles'

const store = configureStore({
  reducer: {
    info,
    MenuSlice,
    CommunitySlice,
    PropertyCompanySlice,
    OrganizationInfoSlice,
    EmployeesSlice,
    RolesSlice
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
