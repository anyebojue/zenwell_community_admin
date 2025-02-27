import { configureStore } from '@reduxjs/toolkit'
import info from './global'
import MenuSlice from './develop/menu'
import CommunitySlice from './platform/community'
import PropertyCompanySlice from './platform/propertyCompany'
import OrganizationInfoSlice from './platform/organization/organizationInfo'
import EmployeesSlice from './platform/organization/employees'
import RolesSlice from './platform/organization/roles'
import CommunityAnnouncementSlice from './property/communitys/communityAnnouncement'
import RoomRenovationSlice from './property/communitys/roomRenovation'
import RoomRenovationDetailSlice from './property/communitys/roomRenovationDetail'
import RoomRenovationRecordSlice from './property/communitys/roomRenovationRecord'
import HousingManagementSlice from './property/houses/housingManagement'
import ReleaseSlice from './property/communitys/release'
import ReleaseTypeSlice from './property/communitys/releaseType'
import UnitSlice from './property/houses/unit'
import RoomSlice from './property/houses/room'
import OwnerSlice from './property/houses/owner'
import VenueSlice from './property/houses/venue'
import SpaceSlice from './property/houses/space'
import SpaceOpenTimeSlice from './property/houses/spaceOpenTime'
import SpacePersonSlice from './property/houses/spacePerson'
import PayFeeSlice from './property/feeConfig/payFee'
import FeeConfigTypeSlice from './property/feeConfig/feeConfigType'
import FeeConfigSlice from './property/feeConfig/feeConfig'
import PayFeeConfigDiscountSlice from './property/feeConfig/payFeeConfigDiscount'
import FeeDiscountSlice from './property/feeConfig/feeDiscount'
import FeeDiscountRuleSpecSlice from './property/feeConfig/feeDiscountRuleSpec'
import FeeDiscountRuleSlice from './property/feeConfig/feeDiscountRule'
import FeeFormulaSlice from './property/feeConfig/feeFormula'
import MeterTypeSlice from './property/feeConfig/meterType'
import MeterWaterSlice from './property/feeConfig/meterWater'
import FeeComboSlice from './property/feeConfig/feeCombo'
import FeeComboMemberSlice from './property/feeConfig/feeComboMember'
import PayFeeDetailSlice from './property/feeConfig/payFeeDetail'
import ReturnPayFeeSlice from './property/feeConfig/returnPayFee'
import ApplyRoomDiscountTypeSlice from './property/feeConfig/applyRoomDiscountType'
import ApplyRoomDiscountSlice from './property/feeConfig/applyRoomDiscount'
import ApplyRoomDiscountRecordSlice from './property/feeConfig/applyRoomDiscountRecord'
import FeeReceiptSlice from './property/feeConfig/feeReceipt'
import FeeReceiptDetailSlice from './property/feeConfig/feeReceiptDetail'
import SpaceConfirmOrderSlice from './property/houses/spaceConfirmOrder'
import ImportFeeSlice from './property/feeConfig/importFee'
import FeeImportDetailSlice from './property/feeConfig/feeImportDetail'
import OwnerInvoiceSlice from './property/houses/ownerInvoice'
import OwnerInvoiceApplySlice from './property/houses/ownerInvoiceApply'
import OwnerInvoiceApplyItemSlice from './property/houses/ownerInvoiceApplyItem'
import OwnerInvoiceApplyEventSlice from './property/houses/ownerInvoiceApplyEvent'
import RepairSettingSlice from './property/repair/repairSetting'
import RepairPoolSlice from './property/repair/repairPool'
import RepairStaffSlice from './property/repair/repairStaff'
import SpectionSlice from './property/inspection/spection'
import SpectionPointSlice from './property/inspection/spectionPoint'
import SpectionRouteSlice from './property/inspection/spectionRoute'
import SpectionItemSlice from './property/inspection/spectionItem'
import SpectionPlanSlice from './property/inspection/spectionPlan'
import StaffSlice from './property/repair/staff'
import SpectionTaskSlice from './property/inspection/spectionTask'
import SpectionTaskDetailSlice from './property/inspection/spectionTaskDetail'
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
    RoomRenovationSlice,
    RoomRenovationDetailSlice,
    RoomRenovationRecordSlice,
    HousingManagementSlice,
    ReleaseSlice,
    ReleaseTypeSlice,
    UnitSlice,
    RoomSlice,
    OwnerSlice,
    VenueSlice,
    SpaceSlice,
    SpaceOpenTimeSlice,
    SpacePersonSlice,
    SpaceConfirmOrderSlice,
    PayFeeSlice,
    FeeConfigTypeSlice,
    FeeConfigSlice,
    PayFeeDetailSlice,
    ReturnPayFeeSlice,
    ApplyRoomDiscountTypeSlice,
    ApplyRoomDiscountSlice,
    ApplyRoomDiscountRecordSlice,
    FeeReceiptSlice,
    FeeReceiptDetailSlice,
    PayFeeConfigDiscountSlice,
    FeeDiscountSlice,
    FeeDiscountRuleSlice,
    FeeDiscountRuleSpecSlice,
    FeeFormulaSlice,
    MeterTypeSlice,
    MeterWaterSlice,
    FeeComboSlice,
    FeeComboMemberSlice,
    OwnerInvoiceSlice,
    OwnerInvoiceApplySlice,
    OwnerInvoiceApplyItemSlice,
    OwnerInvoiceApplyEventSlice,
    ImportFeeSlice,
    FeeImportDetailSlice,
    RepairSettingSlice,
    RepairPoolSlice,
    RepairStaffSlice,
    SpectionSlice,
    SpectionPointSlice,
    SpectionRouteSlice,
    SpectionItemSlice,
    SpectionPlanSlice,
    StaffSlice,
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
