import { memo, useCallback, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { BusinessPurchaseApplyReply } from 'api/model/property/purchase/businessPurchaseApplyModel'
import { Chip } from '@mui/material'

const statusValue: Record<string, string> = {
  Y: '是',
  N: '否',
  T: '通用'
}

const UNIT_OPTIONS: Record<string, string> = {
  '1001': '个',
  '1002': '次',
  '1003': '米',
  '1004': '台',
  '1005': '副',
  '1006': '把',
  '1007': '套',
  '1008': '平米',
  '1009': '条/次',
  '1010': '套/次',
  '1011': '个/次',
  '1012': '盒',
  '1013': '箱',
  '1014': '瓶',
  '1015': '卷',
  '1016': '张',
  '1017': '桶',
  '1018': '只',
  '1019': '支',
  '1020': '片',
  '1021': '条',
  '1022': '根',
  '1023': '块',
  '1024': '吨',
  '1025': '节',
  '1026': '件',
  '1027': '本',
  '1028': '提',
  '1029': '袋',
  '1030': '辆',
  '1031': '双',
  '1032': '公',
  '1033': '包',
  '1034': '克',
  '1035': '部',
  '1036': '匹',
  '1037': '升'
}

interface PlanIndexProps {
  dialogValue: BusinessPurchaseApplyReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  return (
    <DataGrid
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={dialogValue.procurementResourceStores}
      columns={[
        {
          field: 'resourceStoreType.name',
          headerName: '物品类型',
          width: 150,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            `${row.resourceStoreSpecification?.resourceStoreType?.storeType?.name} > ${row.resourceStoreSpecification?.resourceStoreType?.name}`
        },
        {
          field: 'resName',
          headerName: '物品名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'storehouse.shName',
          headerName: '所属仓库',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.storehouse?.shName
        },
        {
          field: 'resourceStoreSpecification.specName',
          headerName: '物品规格',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.resourceStoreSpecification?.specName}`
        },
        { field: 'action', headerName: '供应商', flex: 1 },
        {
          field: 'resCode',
          headerName: '物品编码',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'isFixed',
          headerName: '固定物品',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.isFixed!] || '-'} />
        },
        {
          field: 'averagePrice',
          headerName: '参考单价',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `¥${row.averagePrice}`
        },
        {
          field: 'originalStock',
          headerName: '原有库存',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.originalStock}${UNIT_OPTIONS[String(row.unitCode)]}`
        },
        {
          field: 'stock',
          headerName: '现有库存',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.stock}${UNIT_OPTIONS[String(row.unitCode)]}`
        },
        {
          field: 'quantity',
          headerName: '申请数量',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.quantity}${UNIT_OPTIONS[String(row.unitCode)]}`
        },
        { field: 'remark', headerName: '申请备注', flex: 1 },
        { field: 'price', headerName: '采购单价', flex: 1 },
        { field: 'purchaseQuantity', headerName: '采购数量', flex: 1 },
        { field: 'purchaseRemark', headerName: '采购备注', flex: 1 }
      ]}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationMode="server"
      rowCount={dialogValue.procurementResourceStores.length}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: dialogValue.procurementResourceStores.length
          }
        }
      }}
    />
  )
}

export default memo(PlanIndex)
