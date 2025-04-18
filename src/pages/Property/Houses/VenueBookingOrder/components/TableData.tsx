import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpacePersonReply } from 'api/model/property/houses/spacePersonModel'
import { find, update } from 'modules/property/houses/spacePerson'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Chip
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { WarningRounded } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface TableDataProps {
  dialogValue: SpacePersonReply
  setDialogValue: Dispatch<SetStateAction<SpacePersonReply>>
}

const statusValue: Record<string, string> = {
  '1': '现金',
  '2': '微信',
  '3': '支付宝'
}

const statusType: Record<string, string> = {
  '1': '预约成功',
  '2': '预约失败',
  '3': '待审核',
  '4': '待支付'
}

const TableData: React.FC<TableDataProps> = ({ dialogValue, setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpacePersonSlice)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const renderActionButtons = (row: SpacePersonReply) => {
    const actions = [{ title: '取消预约', action: 'cancel' }]
    return actions.map(({ title }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => {
          setOpen(true)
          setDialogValue(row)
        }}
      />
    ))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const action = update({ id: dialogValue?.id, stateCd: '5' })
      const res = await dispatch(action)
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
      message.success('取消成功')
      setOpen(false)
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
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
            field: 'space.venue.name',
            headerName: '场馆',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.space?.venue?.name
          },
          {
            field: 'space.name',
            headerName: '场地',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.space?.name
          },
          {
            field: 'personName',
            headerName: '预约人',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'personTel',
            headerName: '预约电话',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'appointmentTime',
            headerName: '预约日期',
            width: 180,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'hours',
            headerName: '预约时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'receivableAmount',
            headerName: '应收金额',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'receivedAmount',
            headerName: '实收金额',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'payWay',
            headerName: '支付方式',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.payWay!] || '未知'} />
          },
          {
            field: 'stateCd',
            headerName: '状态',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusType[row.stateCd!] || '未知'} />
          },
          {
            field: 'createdAt',
            headerName: '创建时间',
            width: 180,
            headerAlign: 'center',
            align: 'center'
          },
          { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 100,
            getActions: ({ row }) => renderActionButtons(row),
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningRounded />
          请确认您的操作!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定取消场地预约人，如果是线上预约，自动会退款到预约人账户
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
            onClick={handleSubmit}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(TableData)
