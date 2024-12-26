import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { getCityArea } from 'modules/global'
import { find } from 'modules/platform/community'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Edit } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = (setOpenDialog: Dispatch<SetStateAction<boolean>>) => (
  <Box>
    {[
      {
        title: '修改',
        color: 'secondary' as const,
        icon: <Edit fontSize="small" />,
        onClick: () => setOpenDialog(true)
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
  key: string
  align?: 'left' | 'right' | 'center'
  renderCell?: (_value: T[keyof T]) => ReactNode
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<CommunityReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog
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
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons(setOpenDialog)
    }
  ]

  const fetchCityData = useCallback(async () => {
    try {
      const res = await dispatch(getCityArea({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch {
      message.error('获取全国城市列表失败，请刷新页面或检查网络问题')
    }
  }, [dispatch])

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchCityData()
    fetchData()
  }, [fetchCityData, fetchData])

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
