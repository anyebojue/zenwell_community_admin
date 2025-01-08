import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairSettingReply } from 'api/model/property/repairSettingModel'
import { find } from 'modules/property/repairSetting'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Build, Edit } from '@mui/icons-material'
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
        title: '绑定维修师傅',
        color: 'primary' as const,
        icon: <Build fontSize="small" />,
        onClick: () => message.info('未实现')
      },
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
    { key: 'repairTypeName', headerName: '类型名称', align: 'center' },
    {
      key: 'repairType',
      headerName: '报修设置类型',
      align: 'center',
      renderCell: row => (row.repairType === '200' ? '维修单' : '保洁单')
    },
    {
      key: 'repairWay',
      headerName: '派单方式',
      align: 'center',
      renderCell: row =>
        row.repairWay === 100
          ? '抢单'
          : row.repairWay === 200
            ? '指派'
            : row.repairWay === 300
              ? '轮训'
              : ''
    },
    {
      key: 'publicArea',
      headerName: '区域',
      align: 'center',
      renderCell: row => (row.repairWay === 0 ? '非房屋' : '房屋')
    },
    {
      key: 'isShow',
      headerName: '业主端展示',
      align: 'center',
      renderCell: row => (row.isShow === 0 ? '否' : '是')
    },
    {
      key: 'repairSettingType',
      headerName: '通知方式',
      align: 'center',
      renderCell: row =>
        row.repairSettingType === '0'
          ? '微信'
          : row.repairSettingType === '1'
            ? '短信'
            : row.repairSettingType === '2'
              ? '微信+员工工牌'
              : ''
    },
    {
      key: 'returnVisitFlag',
      headerName: '是否回访',
      align: 'center',
      renderCell: row =>
        row.returnVisitFlag === 1
          ? '不回访'
          : row.returnVisitFlag === 2
            ? '已评价不回访'
            : row.returnVisitFlag === 3
              ? '回访'
              : ''
    },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
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
