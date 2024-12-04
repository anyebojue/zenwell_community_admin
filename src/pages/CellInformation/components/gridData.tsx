import { Box, Chip, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit, Sync } from '@mui/icons-material'
import { ReactNode } from 'react'

const renderStatusChip = (value: string | undefined) => {
  const colors: { [key: string]: 'success' | 'default' } = {
    审核完成: 'success',
    Offline: 'default'
  }
  return <Chip label={value} color={colors[value || '']} size="small" />
}

const ActionColumn = (): ReactNode => (
  <Box>
    <Tooltip title="同步 IOT">
      <IconButton size="small" color="primary">
        <Sync fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="修改">
      <IconButton size="small" color="secondary">
        <Edit fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="删除">
      <IconButton size="small" color="error">
        <Delete fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
)

interface RowData {
  id: string
  name: string
  position: string
  cityCode: string
  communityCode: string
  status: string
  operate: string
}

interface Column<T> {
  headerName: string
  key: keyof T
  align?: 'left' | 'right' | 'center'
  // eslint-disable-next-line no-unused-vars
  renderCell?: (value: T[keyof T]) => ReactNode
}

export const columns: Column<RowData>[] = [
  { key: 'id', headerName: '小区ID', align: 'center' },
  { key: 'name', headerName: '小区名称', align: 'center' },
  { key: 'position', headerName: '附近地标', align: 'center' },
  { key: 'cityCode', headerName: '城市编码', align: 'center' },
  { key: 'communityCode', headerName: '社区编码', align: 'center' },
  {
    key: 'status',
    headerName: '状态',
    align: 'center',
    renderCell: value => renderStatusChip(value)
  },
  {
    key: 'operate',
    headerName: '操作',
    align: 'center',
    renderCell: () => <ActionColumn />
  }
]

export const rows: RowData[] = Array.from({ length: 30 }, (_, index) => ({
  id: String(index + 1),
  name: index % 2 === 0 ? 'WZ万洲小区' : '东方化工厂',
  position: index % 3 === 0 ? '五四广场' : '东方小区',
  cityCode: index % 2 === 0 ? '山东省青岛市市南区' : '湖北省襄阳市襄城区',
  communityCode: '25555321',
  status: '审核完成',
  operate: ''
}))
