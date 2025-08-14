import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/purchase/resourceStore'
import { find as findStore } from 'modules/property/purchase/storeType'
import { find as findStorehouse } from 'modules/property/purchase/storehouse'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Chip } from '@mui/material'
import { ResourceStoreReply } from 'api/model/property/purchase/resourceStoreModel'

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

interface AssociatedTableDataProps {
  setDialogValue: Dispatch<SetStateAction<ResourceStoreReply[]>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({ setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ResourceStoreSlice)

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
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    fetchData(findStore, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findStorehouse, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      const selectedRows = list.filter(row => rowSelectionModel.includes(row.id as string))
      setDialogValue(selectedRows as ResourceStoreReply[])
    },
    [list, setDialogValue]
  )

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'storehouse.shName',
          headerName: '仓库',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.storehouse?.shName
        },
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
          field: 'resourceStoreSpecification.specName',
          headerName: '物品规格',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.resourceStoreSpecification?.specName}`
        },
        {
          field: 'resCode',
          headerName: '物品编号',
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
          field: 'price',
          headerName: '参考价格',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `¥${row.price}`
        },
        {
          field: 'stock',
          headerName: '物品库存',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.stock}${UNIT_OPTIONS[String(row.unitCode)]}`
        }
      ]}
      onRowSelectionModelChange={handleRowSelection}
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

export default memo(AssociatedTableData)
