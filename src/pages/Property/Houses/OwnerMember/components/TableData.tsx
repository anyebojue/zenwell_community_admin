import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Article, Delete } from '@mui/icons-material'
import message from 'components/Message'
import { find } from 'modules/property/owner'
import { OwnerReply } from 'api/model/property/ownerModel'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: OwnerReply | undefined
  setDialogValue: Dispatch<SetStateAction<OwnerReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, selectedRows, setSelectedRows }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerSlice)
  const [delOpen, setDelOpen] = useState(false)
  console.log(delOpen)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size
        })
      )
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

  const columns: Column<OwnerReply>[] = [
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'sex', headerName: '性别', align: 'center' },
    { key: 'ownerTypeCd', headerName: '类型', align: 'center' },
    { key: 'idCard', headerName: '身份证', align: 'center' },
    { key: 'link', headerName: '联系方式', align: 'center' },
    { key: 'address', headerName: '家庭住址', align: 'center' },
    { key: 'userId', headerName: '创建人', align: 'center' },
    { key: 'remark', headerName: '备注', align: 'center' },
    { key: 'name', headerName: '门禁钥匙', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
            {
              title: '详情',
              color: 'primary' as const,
              icon: <Article fontSize="small" />,
              onClick: () => message.info('未实现')
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
    }
  ]

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
