import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/purchase/purchaseApplyDetail'
import { find as findStore } from 'modules/property/purchase/storeType'
import { find as findStorehouse } from 'modules/property/purchase/storehouse'
import { find as findSupplier } from 'modules/property/purchase/resourceSupplier'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const statusValues: Record<string, string> = {
  Y: '是',
  N: '否',
  T: '通用'
}

const statusValue: Record<string, string> = {
  '10000': '入库',
  '20000': '出库'
}

const statusCd: Record<string, string> = {
  '1000': '未审核',
  '1001': '审核中',
  '1002': '已审核',
  '1003': '完结',
  '1004': '未通过'
}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PurchaseApplyDetailSlice)
  const result = list.flatMap(item =>
    item.procurementResourceStore
      ? item.procurementResourceStore.map(store => ({
          communityId: item.communityId,
          id: item.id,
          userName: item.userName,
          endUserName: item.endUserName,
          resOrderType: item.resOrderType,
          storeName: store.resourceStoreSpecification?.resourceStoreType?.storeType?.name,
          rstName: store.resourceStoreSpecification?.resourceStoreType?.name,
          resName: store.resName,
          rssName: store.resourceStoreSpecification?.specName,
          isFixed: store.isFixed,
          rsName: '',
          shName: store.storehouse?.shName,
          warehousingWay: item.warehousingWay,
          quantity: store.quantity,
          purchaseQuantity: store.purchaseQuantity,
          price: store.price,
          totalPrice: Number(store.price) * Number(store.quantity),
          purchaseRemark: store.purchaseRemark,
          statusCd: item.statusCd,
          createdAt: item.createdAt
        }))
      : []
  )

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, isExport: true },
      '正在加载列表中，请稍后...'
    )
    fetchData(findStore, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findStorehouse, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findSupplier, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  return (
    <DataGrid
      sx={{
        mt: 1,
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        }
      }}
      getRowHeight={() => 100}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={result}
      columns={[
        {
          field: 'id',
          headerName: '申请单号',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'userName',
          headerName: '申请人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'endUserName',
          headerName: '使用人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'resOrderType',
          headerName: '出入库类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.resOrderType!] || '-'} />
        },
        {
          field: 'storeName',
          headerName: '物品类型',
          flex: 2,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.storeName}>${row.rstName}`
        },
        {
          field: 'resName',
          headerName: '物品名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'rssName',
          headerName: '物品规格',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'isFixed',
          headerName: '是否是固定物品',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValues[row.isFixed!] || '-'} />
        },
        {
          field: 'rsName',
          headerName: '物品供应商',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'shName',
          headerName: '物品仓库',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'warehousingWay',
          headerName: '采购/出库方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.warehousingWay!] || '-'} />
        },
        {
          field: 'quantity',
          headerName: '申请数量',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'purchaseQuantity',
          headerName: '采购/出库数量',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'price',
          headerName: '采购价格',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'totalPrice',
          headerName: '总价',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'purchaseRemark',
          headerName: '申请备注',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'statusCd',
          headerName: '状态',
          flex: 1.5,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusCd[row.statusCd!] || '-'} />
        },
        {
          field: 'createdAt',
          headerName: '创建时间',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        }
      ]}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationMode="server"
      rowCount={Number(page.total)}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: Number(page.size)
          }
        }
      }}
    />
  )
}

export default memo(TableData)
