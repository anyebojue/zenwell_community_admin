import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/owner'
import { OwnerReply } from 'api/model/property/ownerModel'
import { Tooltip, IconButton, Box } from '@mui/material'
import { Block, Delete, Edit, Login, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue?: OwnerReply
  setDialogValue: Dispatch<SetStateAction<OwnerReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.OwnerSlice)

  const columns: Column<OwnerReply>[] = [
    { key: 'id', headerName: '业主ID', align: 'center' },
    { key: 'name', headerName: '姓名', align: 'center' },
    {
      key: 'sex',
      headerName: '性别',
      align: 'center',
      renderCell: row => (row.sex === '0' ? '女' : '男')
    },
    { key: 'idCard', headerName: '身份证', align: 'center' },
    { key: 'link', headerName: '联系方式', align: 'center' },
    { key: 'address', headerName: '家庭住址', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => (
        <Box>
          {[
            {
              title: '修改业主',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => setOpenDialog(true)
            },
            {
              title: '删除业主',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
            },
            {
              title: '入住房屋',
              color: 'success' as const,
              icon: <Login fontSize="small" />
            },
            {
              title: '房屋解绑',
              color: 'warning' as const,
              icon: <Block fontSize="small" />,
              onClick: () => navigate('/houses/CheckOut', { state: { value: row } })
            },
            {
              title: '详情',
              color: 'info' as const,
              icon: <FileCopy fontSize="small" />
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
