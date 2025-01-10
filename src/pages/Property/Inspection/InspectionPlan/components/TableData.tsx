import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairSettingReply } from 'api/model/property/repairSettingModel'
import { find } from 'modules/property/repairSetting'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Block, Edit, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = (
  setDialogType: Dispatch<SetStateAction<string>>,
  setOpenDialog: Dispatch<SetStateAction<boolean>>,
  setDelOpen: Dispatch<SetStateAction<boolean>>
) => (
  <Box>
    {[
      {
        title: '修改',
        color: 'secondary' as const,
        icon: <Edit fontSize="small" />,
        onClick: () => {
          setOpenDialog(true)
          setDialogType('edit')
        }
      },
      {
        title: '删除',
        color: 'error' as const,
        icon: <Delete fontSize="small" />,
        onClick: () => setDelOpen(true)
      },
      {
        title: '停用',
        color: 'primary' as const,
        icon: <Block fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '详情',
        color: 'primary' as const,
        icon: <FileCopy fontSize="small" />,
        onClick: () => message.info('未实现')
      }
    ].map((action, index) => (
      <Tooltip title={action.title} key={index}>
        <IconButton size="small" color={action.color} onClick={action.onClick}>
          {action.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Box>
)

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<RepairSettingReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairSettingSlice)

  const columns: Column<RepairSettingReply>[] = [
    { key: 'createdAt', headerName: '计划名称', align: 'center' },
    { key: 'createdAt', headerName: '计划路线', align: 'center' },
    { key: 'createdAt', headerName: '计划周期', align: 'center' },
    { key: 'createdAt', headerName: '签到方式', align: 'center' },
    { key: 'remark', headerName: '日期范围', align: 'center' },
    { key: 'remark', headerName: '时间范围', align: 'center' },
    { key: 'remark', headerName: '任务提前（分钟）', align: 'center' },
    { key: 'remark', headerName: '制定人', align: 'center' },
    { key: 'remark', headerName: '制定时间', align: 'center' },
    { key: 'remark', headerName: '状态', align: 'center' },
    { key: 'remark', headerName: '巡检人员', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons(setDialogType, setOpenDialog, setDelOpen)
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <TableList
      rows={list}
      columns={columns}
      setDialogValue={setDialogValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(TableData)
