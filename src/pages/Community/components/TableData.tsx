import { Box, Chip, Tooltip, IconButton, Typography } from '@mui/material'
import { Delete, Edit, Sync } from '@mui/icons-material'
import { memo, ReactNode, useCallback, useEffect, useState } from 'react'
import { CommunityReply } from 'api/model/communityModel'
import message from 'components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/community'
import OrderTable from './TableOrder'
import FormDialog from './FormDialog'

const ActionColumn = (): ReactNode => {
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <Box>
      <Tooltip title="同步 IOT">
        <IconButton size="small" color="primary">
          <Sync fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="修改"
        onClick={() => {
          setOpenDialog(true)
        }}
      >
        <IconButton size="small" color="secondary">
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="删除">
        <IconButton size="small" color="error">
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
      <FormDialog open={openDialog} dialogType="edit" onClose={() => setOpenDialog(false)} />
    </Box>
  )
}

const renderStatusChip = (value: string | number | undefined) => {
  const colors: { [key: string]: 'success' | 'default' } = {
    审核完成: 'success',
    Offline: 'default'
  }
  const valueStr = value !== undefined ? String(value) : ''
  return <Chip label={valueStr} color={colors[valueStr] || 'default'} size="small" />
}

export interface Column<T> {
  headerName: string
  key: string
  align?: 'left' | 'right' | 'center'
  // eslint-disable-next-line no-unused-vars
  renderCell?: (value: T[keyof T]) => ReactNode
}

const GridData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)
  const [loading, setLoading] = useState(false)

  const columns: Column<CommunityReply>[] = [
    { key: 'id', headerName: '小区ID', align: 'center' },
    { key: 'name', headerName: '小区名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '附近地标', align: 'center' },
    { key: 'cityCode', headerName: '城市编码', align: 'center' },
    { key: 'bId', headerName: '社区编码', align: 'center' },
    {
      key: 'status_cd',
      headerName: '状态',
      align: 'center',
      renderCell: (value: string | number | undefined) => renderStatusChip(value)
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => <ActionColumn />
    }
  ]

  const fetchData = useCallback(
    async (params?: CommunityReply & PaginationParams) => {
      setLoading(true)
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size, ...params }))
      } catch {
        message.error('列表加载失败，请刷新页面或检查网络问题')
      } finally {
        closeLoading()
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <Typography>加载中...</Typography>
        </Box>
      ) : (
        <OrderTable rows={list} columns={columns} />
      )}
    </Box>
  )
}

export default memo(GridData)
