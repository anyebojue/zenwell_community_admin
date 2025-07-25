import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/owner'
import { OwnerReply } from 'api/model/property/houses/ownerModel'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { GridRowSelectionModel } from '@mui/x-data-grid-pro'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  dialogValue?: OwnerReply
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<OwnerReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
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
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.OwnerSlice)

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
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: OwnerReply) => {
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
        case 'checkInOwner':
          navigate('/houses/CheckInOwner', { state: { value: row } })
          break
        case 'checkOut':
          navigate('/houses/CheckOut', { state: { value: row } })
          break
        case 'details':
          message.info('同步操作未实现')
          break
      }
    },
    [navigate, setDelOpen, setDialogType, setDialogValue, setOpenDialog, setSelectedRows]
  )

  const renderActionButtons = (row: OwnerReply) => {
    const actions = [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' },
      { title: '入住房屋', action: 'checkInOwner' },
      { title: '房屋解绑', action: 'checkOut' },
      { title: '详情', action: 'details' }
    ]
    return actions.map(({ title, action }) => (
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
  }

  return (
    <DataGrid
      sx={{ mt: 1 }}
      getRowHeight={() => 100}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '业主ID', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: '姓名', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'sex',
          headerName: '性别',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (row.sex === '1' ? '男' : '女')
        },
        {
          field: 'idCard',
          headerName: '身份证',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'link',
          headerName: '联系方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'address',
          headerName: '家庭住址',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'facePhoto',
          headerName: '业主人脸',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (
            <img style={{ height: '80px' }} src={row.facePhoto} alt={row.facePhoto} />
          )
        },
        {
          field: 'accessKey',
          headerName: '门禁钥匙',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'numHouses',
          headerName: '房屋数',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'ownerMembers',
          headerName: '业主成员',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'numVehicles',
          headerName: '车辆数',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'complaints',
          headerName: '投诉',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'maintenanceRequests',
          headerName: '报修',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'outstandingFees',
          headerName: '欠费',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'ownerContract',
          headerName: '业主合同',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 340,
          getActions: ({ row }) => renderActionButtons(row),
          headerAlign: 'center',
          align: 'center'
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

export default memo(TableData)
