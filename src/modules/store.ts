import { configureStore } from '@reduxjs/toolkit'
import info from './global'
import MenuSlice from './develop/menu'
import CommunitySlice from './platform/community'
import PropertyCompanySlice from './platform/propertyCompany'
import OrganizationInfoSlice from './platform/organization/organizationInfo'
import EmployeesSlice from './platform/organization/employees'
import RolesSlice from './platform/organization/roles'
import ReportCustomGroupSlice from './platform/reportConfiguration/reportCustomGroup'
import ReportCustomSlice from './platform/reportConfiguration/reportCustom'
import ReportCustomComponentSlice from './platform/reportConfiguration/reportCustomComponent'
import ReportCustomComponentRelSlice from './platform/reportConfiguration/reportCustomComponentRel'
import ReportCustomComponentConditionSlice from './platform/reportConfiguration/reportCustomComponentCondition'
import ReportCustomComponentFooterSlice from './platform/reportConfiguration/reportCustomComponentFooter'
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
import FeeConfigLogSlice from './property/feeConfig/feeConfigLog'
import PayFeeDetailSlice from './property/feeConfig/payFeeDetail'
import ReturnPayFeeSlice from './property/feeConfig/returnPayFee'
import PayFeeAuditSlice from './property/feeConfig/payFeeAudit'
import ApplyRoomDiscountTypeSlice from './property/feeConfig/applyRoomDiscountType'
import ApplyRoomDiscountSlice from './property/feeConfig/applyRoomDiscount'
import ApplyRoomDiscountRecordSlice from './property/feeConfig/applyRoomDiscountRecord'
import FeeReceiptSlice from './property/feeConfig/feeReceipt'
import FeeReceiptDetailSlice from './property/feeConfig/feeReceiptDetail'
import SpaceConfirmOrderSlice from './property/houses/spaceConfirmOrder'
import ImportFeeSlice from './property/feeConfig/importFee'
import FeeImportDetailSlice from './property/feeConfig/feeImportDetail'
import PayFeeBatchSlice from './property/feeConfig/payFeeBatch'
import ReportOweFeeSlice from './property/feeConfig/reportOweFee'
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
import ReportFeeYearCollectionSlice from './property/report/reportFeeYearCollection'
import ReportDictSlice from './property/report/reportDict'
import ReportQueryPayFeeDepositSlice from './property/report/queryPayFeeDeposit'
import QueryHuaningOweFeeSlice from './property/report/queryHuaningOweFee'
import QueryHuaningOweFeeDetailSlice from './property/report/queryHuaningOweFeeDetail'
import QueryHuaningPayFeeSlice from './property/report/queryHuaningPayFee'
import QueryInspectionReportSlice from './property/report/queryInspectionReport'
import QueryReceivedReportSlice from './property/report/queryReceivedReport'
import QueryRepairReportSlice from './property/report/queryRepairReport'
import QueryReportOwnerPayFeeSlice from './property/report/queryReportOwnerPayFee'
import QueryNoFeeRoomsSlice from './property/report/queryNoFeeRooms'
import QueryRepairSlice from './property/report/queryRepair'
import QueryPayFeeDetailSlice from './property/report/queryPayFeeDetail'
import QueryOweFeeDetailSlice from './property/report/queryOweFeeDetail'
import QueryDeadlineFeeSlice from './property/report/queryDeadlineFee'
import QueryPrePaymentSlice from './property/report/queryPrePayment'
import QueryFeeDataReportSlice from './property/report/queryFeeDataReport'
import QueryOrderDataReportSlice from './property/report/queryOrderDataReport'
import QueryInoutDataReportSlice from './property/report/queryInoutDataReport'
import QueryOthersDataReportSlice from './property/report/queryOthersDataReport'
import QueryMonthReceivedDetailSlice from './property/report/queryMonthReceivedDetail'
import QueryMonthOweDetailSlice from './property/report/queryMonthOweDetail'
import QueryReceivedDetailStatisticsSlice from './property/report/queryReceivedDetailStatistics'
import QueryReceivedWayStatisticsSlice from './property/report/queryReceivedWayStatistics'
import QueryOweStatisticsSlice from './property/report/queryOweStatistics'
import QueryOweDetailStatisticsSlice from './property/report/queryOweDetailStatistics'
import QueryDataReportFeeStatisticsSlice from './property/report/queryDataReportFeeStatistics'
import QueryReceivedStatisticsSlice from './property/report/queryReceivedStatistics'
import QueryReportFeeDetailRoomSlice from './property/report/queryReportFeeDetailRoom'
import QueryReportFeeDetailOwnerSlice from './property/report/queryReportFeeDetailOwner'
import QueryReportFeeDetailCarSlice from './property/report/queryReportFeeDetailCar'
import QueryReportFeeDetailContractSlice from './property/report/queryReportFeeDetailContract'
import QueryReportFeeSummarySlice from './property/report/queryReportFeeSummary'
import ParkingAreaSlice from './property/parking/parkingArea'
import ParkingSpaceInfoSlice from './property/parking/parkingSpaceInfo'
import ParkingBoxSlice from './property/parking/parkingBox'
import OwnerCarSlice from './property/parking/ownerCar'
import CarInoutSlice from './property/parking/carInout'
import RemainingParkingSpaceSlice from './property/parking/remainingParkingSpace'
import ChargeMonthCardSlice from './property/parking/chargeMonthCard'
import ChargeMonthOrderSlice from './property/parking/chargeMonthOrder'
import ParkingSpaceApplySlice from './property/parking/parkingSpaceApply'
import CarBlackWhiteSlice from './property/parking/carBlackWhite'
import MachineSlice from './property/parking/machine'
import CarInoutPaymentSlice from './property/parking/carInoutPayment'
import WorkflowSlice from './property/purchase/workflow'
import StorehouseSlice from './property/purchase/storehouse'
import StoreTypeSlice from './property/purchase/storeType'

const store = configureStore({
  reducer: {
    info,
    MenuSlice,
    CommunitySlice,
    PropertyCompanySlice,
    OrganizationInfoSlice,
    EmployeesSlice,
    RolesSlice,
    ReportCustomGroupSlice,
    ReportCustomSlice,
    ReportCustomComponentSlice,
    ReportCustomComponentRelSlice,
    ReportCustomComponentConditionSlice,
    ReportCustomComponentFooterSlice,
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
    FeeConfigLogSlice,
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
    PayFeeAuditSlice,
    OwnerInvoiceSlice,
    OwnerInvoiceApplySlice,
    OwnerInvoiceApplyItemSlice,
    OwnerInvoiceApplyEventSlice,
    ImportFeeSlice,
    FeeImportDetailSlice,
    PayFeeBatchSlice,
    ReportOweFeeSlice,
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
    SystemSettingsSlice,
    ReportFeeYearCollectionSlice,
    ReportDictSlice,
    ReportQueryPayFeeDepositSlice,
    QueryHuaningOweFeeSlice,
    QueryHuaningOweFeeDetailSlice,
    QueryHuaningPayFeeSlice,
    QueryInspectionReportSlice,
    QueryReceivedReportSlice,
    QueryRepairReportSlice,
    QueryReportOwnerPayFeeSlice,
    QueryNoFeeRoomsSlice,
    QueryRepairSlice,
    QueryPayFeeDetailSlice,
    QueryOweFeeDetailSlice,
    QueryDeadlineFeeSlice,
    QueryPrePaymentSlice,
    QueryFeeDataReportSlice,
    QueryOrderDataReportSlice,
    QueryInoutDataReportSlice,
    QueryOthersDataReportSlice,
    QueryMonthReceivedDetailSlice,
    QueryMonthOweDetailSlice,
    QueryReceivedDetailStatisticsSlice,
    QueryReceivedWayStatisticsSlice,
    QueryOweStatisticsSlice,
    QueryOweDetailStatisticsSlice,
    QueryDataReportFeeStatisticsSlice,
    QueryReceivedStatisticsSlice,
    QueryReportFeeDetailRoomSlice,
    QueryReportFeeDetailOwnerSlice,
    QueryReportFeeDetailCarSlice,
    QueryReportFeeDetailContractSlice,
    QueryReportFeeSummarySlice,
    ParkingAreaSlice,
    ParkingSpaceInfoSlice,
    ParkingBoxSlice,
    OwnerCarSlice,
    CarInoutSlice,
    RemainingParkingSpaceSlice,
    ChargeMonthCardSlice,
    ChargeMonthOrderSlice,
    ParkingSpaceApplySlice,
    CarBlackWhiteSlice,
    MachineSlice,
    CarInoutPaymentSlice,
    WorkflowSlice,
    StorehouseSlice,
    StoreTypeSlice
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
