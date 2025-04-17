import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationReply } from 'api/model/property/communitys/roomRenovationModel'
import { find } from 'modules/property/communitys/roomRenovation'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import Examine from './Examine'
import AcceptanceCheck from './AcceptanceCheck'

interface TableDataProps {
  dialogValue: RoomRenovationReply | undefined
  setDialogValue: Dispatch<SetStateAction<RoomRenovationReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1000': '待审核',
  '2000': '审核不通过',
  '3000': '装修中',
  '4000': '待验收',
  '5000': '验收成功',
  '6000': '验收失败'
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RoomRenovationSlice)
  const [examineOpen, setExamineOpen] = useState(false)
  const [acceptanceCheckOpen, setAcceptanceCheckOpen] = useState(false)

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
    (actionType: string, row: RoomRenovationReply) => {
      switch (actionType) {
        case 'examine':
          setDialogValue(row)
          setExamineOpen(true)
          break
        case 'acceptanceCheck':
          setDialogValue(row)
          setAcceptanceCheckOpen(true)
          break
        case 'acceptanceDetail':
          navigate('/communitys/AcceptanceDetail', { state: { value: row } })
          break
        case 'traceRecord':
          navigate('/communitys/TraceRecord', { state: { value: row } })
          break
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [navigate, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: RoomRenovationReply) => {
    const actions = [
      { title: '审核', action: 'examine', status: 1000 },
      { title: '装修验收', action: 'acceptanceCheck', status: 4000 },
      { title: '验收明细', action: 'acceptanceDetail', status: 5000 },
      { title: '跟踪记录', action: 'traceRecord' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
    return actions
      .filter(({ status }) => status === undefined || row.status === status)
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
          { field: 'roomName', headerName: '房屋' },
          { field: 'personName', headerName: '联系人' },
          { field: 'personTel', headerName: '联系电话' },
          {
            field: 'startTime',
            headerName: '装修时间',
            minWidth: 320,
            renderCell: ({ row }) => `${row.startTime}-${row.endTime}`
          },
          { field: 'createdAt', headerName: '申请时间', minWidth: 200 },
          { field: 'renovationCompany', headerName: '装修单位' },
          { field: 'personMain', headerName: '装修负责人' },
          { field: 'personMainTel', headerName: '负责人电话' },
          {
            field: 'status',
            headerName: '状态',
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }: { row: RoomRenovationReply }) => (
              <Chip label={statusValue[row.status!] || '未知状态'} />
            )
          },
          {
            field: 'isPostpone',
            headerName: '是否延期',
            renderCell: ({ row }) => (row.isPostpone === 0 ? '正常' : '延期')
          },
          { field: 'postponeTime', headerName: '延期时间' },
          {
            field: 'isViolation',
            headerName: '是否违规',
            renderCell: ({ row }) => (row.isViolation === 0 ? '正常' : '违规')
          },
          { field: 'violationDesc', headerName: '违规说明' },
          { field: 'remark', headerName: '备注' },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 280,
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
      <Examine dialogValue={dialogValue} openDialog={examineOpen} setOpenDialog={setExamineOpen} />
      <AcceptanceCheck
        dialogValue={dialogValue}
        openDialog={acceptanceCheckOpen}
        setOpenDialog={setAcceptanceCheckOpen}
      />
    </>
  )
}

export default memo(TableData)
