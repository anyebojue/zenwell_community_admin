import { configureStore } from '@reduxjs/toolkit'
import info from './global'
import MenuSlice from './develop/menu'
import CommunitySlice from './platform/community'
import PropertyCompanySlice from './platform/propertyCompany'
import OrganizationInfoSlice from './platform/organizationInfo'
import EmployeesSlice from './platform/employees'
import RolesSlice from './platform/roles'
import CommunityAnnouncementSlice from './property/communityAnnouncement'
import HousingManagementSlice from './property/housingManagement'
import UnitSlice from './property/unit'
import RoomSlice from './property/room'
import OwnerSlice from './property/owner'
import RepairSettingSlice from './property/repairSetting'
import RepairPoolSlice from './property/repairPool'
import RepairStaffSlice from './property/repairStaff'
import SpectionSlice from './property/spection'
import SpectionPointSlice from './property/spectionPoint'
import SpectionRouteSlice from './property/spectionRoute'
import SpectionItemSlice from './property/spectionItem'
import SpectionPlanSlice from './property/spectionPlan'
import SpectionTaskSlice from './property/spectionTask'
import SpectionTaskDetailSlice from './property/spectionTaskDetail'
import SystemSettingsSlice from './property/systemSettings'

const store = configureStore({
  reducer: {
    info,
    MenuSlice,
    CommunitySlice,
    PropertyCompanySlice,
    OrganizationInfoSlice,
    EmployeesSlice,
    RolesSlice,
    CommunityAnnouncementSlice,
    HousingManagementSlice,
    UnitSlice,
    RoomSlice,
    OwnerSlice,
    RepairSettingSlice,
    RepairPoolSlice,
    RepairStaffSlice,
    SpectionSlice,
    SpectionPointSlice,
    SpectionRouteSlice,
    SpectionItemSlice,
    SpectionPlanSlice,
    SpectionTaskSlice,
    SpectionTaskDetailSlice,
    SystemSettingsSlice
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
