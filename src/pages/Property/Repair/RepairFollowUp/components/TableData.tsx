import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { find } from 'modules/property/repair/repairPool'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import ReturnVisitFlag from './ReturnVisitFlag'

interface TableDataProps {
  dialogValue: RepairPoolReply | undefined
  setDialogValue: Dispatch<SetStateAction<RepairPoolReply | undefined>>
}

const TableData: React.FC<TableDataProps> = ({ dialogValue, setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [returnVisitFlag, setReturnVisitFlag] = useState(false)

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
      { 'page.num': page.num, 'page.size': page.size, repairType: '1' },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findRepairSetting,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: RepairPoolReply) => {
      switch (actionType) {
        case 'visit':
          setDialogValue(row)
          setReturnVisitFlag(true)
          break
        case 'details':
          setDialogValue(row)
          navigate('/repair/WorkOrderDetails', { state: { value: row } })
          break
      }
    },
    [navigate, setDialogValue]
  )

  const renderActionButtons = (row: RepairPoolReply) =>
    [
      { title: '回访', action: 'visit' },
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
          { field: 'id', headerName: '工单编码', flex: 1, headerAlign: 'center', align: 'center' },
          {
            field: 'communitId',
            headerName: '位置',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => community.name
          },
          {
            field: 'repairSetting.repairTypeName',
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
          { field: 'tel', headerName: '联系方式', flex: 1, headerAlign: 'center', align: 'center' },
          {
            field: 'appointmentTime',
            headerName: '预约时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 130,
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
      <ReturnVisitFlag
        dialogValue={dialogValue}
        returnVisitFlag={returnVisitFlag}
        setReturnVisitFlag={setReturnVisitFlag}
      />
    </>
  )
}

export default memo(TableData)
