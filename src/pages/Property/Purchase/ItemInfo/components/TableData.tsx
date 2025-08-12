import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ResourceStoreReply } from 'api/model/property/purchase/resourceStoreModel'
import { find } from 'modules/property/purchase/resourceStore'
import { find as findStore } from 'modules/property/purchase/storeType'
import { find as findStorehouse } from 'modules/property/purchase/storehouse'
import { find as findSpecification } from 'modules/property/purchase/resourceStoreSpecification'
import { Button, Chip, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Close } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

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

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<ResourceStoreReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ResourceStoreSlice)
  const [openViewDialog, setOpenViewDialog] = useState(false)

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
    fetchData(findSpecification, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: ResourceStoreReply) => {
      switch (actionType) {
        case 'edit':
          setDialogType('edit')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ResourceStoreReply) =>
    [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ].map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          marginRight: '-5px',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))

  return (
    <>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.2'
          },
          mt: 1
        }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          {
            field: 'storehouse.shName',
            headerName: '仓库名称',
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
              `${row.resourceStoreType?.storeType?.name} > ${row.resourceStoreType?.name}`
          },
          {
            field: 'resName',
            headerName: '物品名称(编号)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => `${row.resName}(${row.resCode})`
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
            field: 'outHighPrice',
            headerName: '收费标准',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => `¥${row.outHighPrice}`
          },
          {
            field: 'stock',
            headerName: '物品库存',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => `${row.stock}${UNIT_OPTIONS[String(row.unitCode)]}`
          },
          {
            field: 'miniStock',
            headerName: '最小计量',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) =>
              `${row.stock}${UNIT_OPTIONS[String(row.unitCode)]}=${row.miniStock}${UNIT_OPTIONS[String(row.miniUnitCode)]}`
          },
          {
            field: 'miniUnitStock',
            headerName: '最小计量总数',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => `${row.miniUnitStock}${UNIT_OPTIONS[String(row.miniUnitCode)]}`
          },
          {
            field: 'averagePrice',
            headerName: '物品均价',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => `¥${row.averagePrice}`
          },
          {
            field: 'price*stock',
            headerName: '物品总价',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => (
              <Button
                sx={{ color: '#2660ad', textDecoration: 'underline' }}
                size="small"
                variant="text"
                onClick={() => setOpenViewDialog(true)}
              >
                查询
              </Button>
            )
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 200,
            getActions: ({ row }) => renderActionButtons(row)
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
      <Dialog maxWidth="lg" open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          物品总价
          <IconButton onClick={() => setOpenViewDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DataGrid
            disableRowSelectionOnClick
            disableColumnMenu
            rows={list}
            columns={[
              {
                field: 'resCode',
                headerName: '物品编号',
                width: 100,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'createdAt',
                headerName: '入库时间',
                width: 250,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'price',
                headerName: '单价',
                width: 100,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'stock',
                headerName: '库存',
                width: 100,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'price*stock',
                headerName: '总价',
                width: 150,
                headerAlign: 'center',
                align: 'center',
                renderCell: ({ row }) => row.price! * Number(row.stock)
              }
            ]}
            pageSizeOptions={[25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25
                }
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(TableData)
