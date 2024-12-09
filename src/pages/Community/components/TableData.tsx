import { Box, Chip, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit, Sync } from '@mui/icons-material'
import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { CommunityReply } from 'api/model/communityModel'
import message from 'components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/community'
import TableList from './TableList'

const renderStatusChip = (value: string | number | undefined) => {
  const colors: { [key: string]: 'success' | 'default' } = {
    '': 'success',
    '0': 'default'
  }
  const valueStr = value !== undefined ? String(value) : ''
  return <Chip label={'审核成功'} color={colors[valueStr] || 'default'} size="small" />
}

export interface Column<T> {
  headerName: string
  key: string
  align?: 'left' | 'right' | 'center'
  // eslint-disable-next-line no-unused-vars
  renderCell?: (value: T[keyof T]) => ReactNode
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<CommunityReply | undefined>>
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
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)

  const columns: Column<CommunityReply>[] = [
    { key: 'id', headerName: '小区ID', align: 'center' },
    { key: 'name', headerName: '小区名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '附近地标', align: 'center' },
    { key: 'cityCode', headerName: '城市编码', align: 'center' },
    { key: 'bId', headerName: '社区编码', align: 'center' },
    {
      key: 'state',
      headerName: '状态',
      align: 'center',
      renderCell: (value: string | number | undefined) => renderStatusChip(value)
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          <Tooltip title="同步 IOT">
            <IconButton size="small" color="primary">
              <Sync fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="修改" onClick={() => setOpenDialog(true)}>
            <IconButton size="small" color="secondary">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除" onClick={() => setDelOpen(true)}>
            <IconButton size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const fetchData = useCallback(
    async (params?: CommunityReply & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size, ...params }))
      } catch {
        message.error('列表加载失败，请刷新页面或检查网络问题')
      } finally {
        closeLoading()
      }
    },
    [dispatch, page.num, page.size]
  )

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
