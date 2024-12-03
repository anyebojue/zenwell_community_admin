import { Box, Chip, Tooltip, IconButton } from '@mui/material'
import { Block, Delete, Edit, ManageAccounts, RestartAlt, Login } from '@mui/icons-material'
import { GridRowsProp, GridColDef } from '@mui/x-data-grid'

const renderSparklineCell = () => {
  return (
    <Box>
      <Tooltip title="管理小区">
        <IconButton size="small" color="primary">
          <ManageAccounts fontSize="small" />
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
      <Tooltip title="登录">
        <IconButton size="small" color="success">
          <Login fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="限制登录">
        <IconButton size="small" color="warning">
          <Block fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="重置密码">
        <IconButton size="small" color="info">
          <RestartAlt fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const renderStatus = (status: '审核完成' | 'Offline') => {
  const colors: { [index: string]: 'success' | 'default' } = {
    审核完成: 'success',
    Offline: 'default'
  }
  return <Chip label={status} color={colors[status]} size="small" />
}

export const columns: GridColDef[] = [
  { field: 'id', headerName: '小区ID', flex: 0.5, minWidth: 50 },
  { field: 'name', headerName: '小区名称', flex: 1, minWidth: 100 },
  { field: 'position', headerName: '附近地标', flex: 1, minWidth: 100 },
  { field: 'cityCode', headerName: '城市编码', flex: 1, minWidth: 100 },
  { field: 'communityCode', headerName: '社区编码', flex: 0.5, minWidth: 100 },
  {
    field: 'status',
    headerName: '状态',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 100,
    renderCell: params => renderStatus(params.value as any)
  },
  {
    field: 'operation',
    headerName: '操作',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 250,
    renderCell: renderSparklineCell
  }
]

export const rows: GridRowsProp = [
  {
    id: '1',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '2',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '3',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '4',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '5',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '6',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '7',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '8',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '9',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '10',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '11',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '12',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '13',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '14',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '15',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '16',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '17',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '18',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '19',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '20',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '21',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '22',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '23',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '24',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '25',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '26',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '27',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  },
  {
    id: '28',
    name: '梯田金科花园	',
    position: '成都市武侯区梯田路1号',
    cityCode: '四川省成都市武侯区	',
    communityCode: 'TTJK0036',
    status: '审核完成'
  },
  {
    id: '29',
    name: 'WZ万洲小区',
    position: '五四广场',
    cityCode: '山东省青岛市市南区',
    communityCode: '25555321',
    status: '审核完成'
  },
  {
    id: '30',
    name: '东方化工厂',
    position: '东方小区',
    cityCode: '湖北省襄阳市襄城区	',
    communityCode: '441000',
    status: '审核完成'
  }
]
