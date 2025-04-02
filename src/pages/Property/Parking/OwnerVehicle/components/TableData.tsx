import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { find } from 'modules/property/parking/ownerCar'
import { find as findOwner } from 'modules/property/houses/owner'
import { find as findParkingSpace } from 'modules/property/parking/parkingSpaceInfo'
import { Box, Chip, Typography } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<OwnerCarReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  H: '月租车',
  S: '出售车',
  I: '内部车',
  NM: '免费车',
  R: '预约车',
  C: '到期车辆'
}

const statusType: Record<string, string> = {
  '9901': '家用小汽车',
  '9902': '客车',
  '9903': '货车',
  '9904': '电动车',
  '9905': '三轮车',
  '9906': '信用期车辆（1个月）'
}

const statusCd: Record<string, string> = {
  '1001': '正常状态',
  '2002': '欠费状态',
  '3003': '车位释放'
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  selectedButton,
  setDialogValue,
  setSelectedRows,
  openDialog,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerCarSlice)

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
      {
        'page.num': page.num,
        'page.size': page.size,
        ...(selectedButton && { leaseType: selectedButton }),
        isExport: true
      },
      '正在加载列表中，请稍后...'
    )
    if (openDialog) {
      fetchData(findOwner, { 'page.disable': true }, '正在加载列表中，请稍后...')
      fetchData(findParkingSpace, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [fetchData, openDialog, page.num, page.size, selectedButton])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: OwnerCarReply) => {
      switch (actionType) {
        case 'discount':
          break
        case 'release':
          break
        case 'card':
          break
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

  const renderActionButtons = (row: OwnerCarReply) => {
    const actions = [
      { title: '续租', action: 'discount', stateCd: '1001' },
      { title: '释放', action: 'release', stateCd: '3003' },
      { title: '买月卡', action: 'card' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
    return actions
      .filter(({ stateCd }) => stateCd === undefined || row.stateCd === stateCd)
      .map(({ title, action }) => (
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
      sx={{
        mt: 1,
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        }
      }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'carNum',
          headerName: '车牌号',
          width: 100,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'memberCount',
          headerName: '成员车辆',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'roomName',
          headerName: '房屋号',
          width: 100,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'leaseType',
          headerName: '车牌类型',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.leaseType!] || '未知状态'} />
        },
        {
          field: 'carType',
          headerName: '车辆类型',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusType[row.carType!] || '未知状态'} />
        },
        { field: 'carColor', headerName: '颜色', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'ownerName',
          headerName: '业主',
          width: 100,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'parkingSpace.name',
          headerName: '车位',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.parkingSpace.num
        },
        {
          field: 'startTime',
          headerName: '有效期',
          minWidth: 190,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (
            <Box
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">{row.startTime}～</Typography>
              <Typography variant="body1">{row.endTime}</Typography>
            </Box>
          )
        },
        {
          field: 'stateCd',
          headerName: '状态',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusCd[row.stateCd!] || '未知状态'} />
        },
        { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 240,
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
  )
}

export default memo(TableData)
