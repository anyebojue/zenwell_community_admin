import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { find } from 'modules/property/parking/ownerCar'
import { find as findOwner } from 'modules/property/houses/owner'
import { find as findParkingSpace } from 'modules/property/parking/parkingSpaceInfo'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import Release from './Release'

interface TableDataProps {
  dialogValue?: OwnerCarReply
  openDiscount: boolean
  setDialogType: Dispatch<SetStateAction<string>>
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<OwnerCarReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
  setOpenDiscout: Dispatch<SetStateAction<boolean>>
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
  '1': '正常',
  '3': '到期',
  '2': '无车位'
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  openDiscount,
  setDialogType,
  selectedButton,
  setDialogValue,
  setSelectedRows,
  openDialog,
  setOpenDialog,
  setDelOpen,
  setOpenDiscout
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerCarSlice)
  const [openRelease, setOpenRelease] = useState(false)
  const [openIotDialog, setOpenIotDialog] = useState(false)
  const [iotDialogContent, setIotDialogContent] = useState('')
  const [iotDialogTitle, setIotDialogTitle] = useState('')

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
    if (openDialog || openDiscount) {
      fetchData(findOwner, { 'page.disable': true }, '正在加载列表中，请稍后...')
      fetchData(findParkingSpace, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [fetchData, openDialog, openDiscount, page.num, page.size, selectedButton])

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
          setDialogValue(row)
          setOpenDiscout(true)
          break
        case 'release':
          setDialogValue(row)
          setOpenRelease(true)
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
    [setOpenDiscout, setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
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
    <>
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          {
            field: 'carNum',
            headerName: '车牌号',
            width: 90,
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
            width: 80,
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
          {
            field: 'carColor',
            headerName: '颜色',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'ownerName',
            headerName: '业主',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'parkingSpace.num',
            headerName: '车位',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.parkingSpace?.num
          },
          {
            field: 'startTime',
            headerName: '有效期',
            width: 180,
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
            width: 110,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
              <Button
                variant="text"
                color="secondary"
                onClick={() => {
                  setIotDialogTitle(`${row.carNum} 同步物联网详情`)
                  setIotDialogContent(row.iotRemark || '暂无物联网详情')
                  setOpenIotDialog(true) // 打开弹窗
                }}
              >
                <Box color="black">{statusCd[row.stateCd!]}</Box>({row.iotStateName})
              </Button>
            )
          },
          { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 220,
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
      <Release
        selectedButton={selectedButton}
        dialogValue={dialogValue}
        openRelease={openRelease}
        setOpenRelease={setOpenRelease}
      />
      <Dialog open={openIotDialog} onClose={() => setOpenIotDialog(false)}>
        <DialogTitle>{iotDialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{iotDialogContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIotDialog(false)} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(TableData)
