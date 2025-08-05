import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { find } from 'modules/property/repair/repairPool'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import TransferOfOrder from './TransferOfOrder'
import Chargeback from './Chargeback'
import Conclude from './Conclude'
import Pause from './Pause'
import Launch from './Launch'

const statusValue: Record<string, string> = {
  1000: '未派单',
  1100: '接单',
  1200: '退单',
  1300: '转单',
  1400: '申请支付',
  1500: '支付失败',
  1700: '待评价',
  1800: '电话回访',
  1900: '办理完成',
  2000: '未办理结单',
  2001: '暂停'
}

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [dialogValue, setDialogValue] = useState<RepairPoolReply | undefined>()
  const [transferOpen, setTransferOpen] = useState(false)
  const [chargebackOpen, setChargebackOpen] = useState(false)
  const [concludeOpen, setConcludeOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)

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
    fetchData(
      findRepairSetting,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: RepairPoolReply) => {
      switch (actionType) {
        case 'transferOrder':
          setDialogValue(row)
          setTransferOpen(true)
          break
        case 'cancelOrder':
          setDialogValue(row)
          setChargebackOpen(true)
          break
        case 'done':
          setDialogValue(row)
          setConcludeOpen(true)
          break
        case 'pause':
          setDialogValue(row)
          setPauseOpen(true)
          break
        case 'launch':
          setDialogValue(row)
          setActivateOpen(true)
          break
        case 'details':
          navigate('/repair/WorkOrderDetails', { state: { value: row } })
          break
      }
    },
    [navigate]
  )

  const renderActionButtons = (row: RepairPoolReply) =>
    [
      { title: '转单', action: 'transferOrder' },
      { title: '退单', action: 'cancelOrder' },
      { title: '办结', action: 'done' },
      { title: '暂停', action: 'pause' },
      { title: '启动', action: 'launch' },
      { title: '详情', action: 'details' }
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
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          {
            field: 'communityId',
            headerName: '位置',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => community.name
          },
          {
            field: 'repairSetting',
            headerName: '报修类型',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.repairSetting?.repairTypeName
          },
          {
            field: 'repairName',
            headerName: '报修人',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'tel',
            headerName: '报修人电话',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'appointmentTime',
            headerName: '预约时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'statusCd',
            headerName: '状态',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.statusCd!] || '未知'} />
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 300,
            getActions: ({ row }) => renderActionButtons(row)
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
      <TransferOfOrder
        dialogValue={dialogValue}
        transferOpen={transferOpen}
        setTransferOpen={setTransferOpen}
      />
      <Chargeback
        dialogValue={dialogValue}
        chargebackOpen={chargebackOpen}
        setChargebackOpen={setChargebackOpen}
      />
      <Conclude
        dialogValue={dialogValue}
        concludeOpen={concludeOpen}
        setConcludeOpen={setConcludeOpen}
      />
      <Pause dialogValue={dialogValue} pauseOpen={pauseOpen} setPauseOpen={setPauseOpen} />{' '}
      <Launch
        dialogValue={dialogValue}
        activateOpen={activateOpen}
        setActivateOpen={setActivateOpen}
      />
    </>
  )
}

export default memo(TableData)
