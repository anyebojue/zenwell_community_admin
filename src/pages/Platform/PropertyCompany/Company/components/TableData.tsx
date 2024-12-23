import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CompanyReply } from 'api/model/platform/propertyCompanyModel'
import { companyfind } from 'modules/platform/propertyCompany'
import { Box, Tooltip, IconButton, Chip } from '@mui/material'
import { Edit, ExitToApp } from '@mui/icons-material'
import message from 'components/Message'
import { find } from 'modules/platform/community'
import { useLocation } from 'react-router-dom'
import TableList from './TableList'
import ExitCell from './ExitCell'

const renderStatusChip = (value: CompanyReply) => {
  const statusMap: Record<string, { label: string; color: 'success' | 'default' }> = {
    '': { label: '审核成功', color: 'success' },
    '0': { label: '未审核', color: 'default' }
  }

  const status = statusMap[String(value.community?.state) || ''] || {
    label: '未知状态',
    color: 'default'
  }
  return <Chip label={status.label} color={status.color} size="small" />
}

const renderActionButtons = ({
  setExitOpen
}: {
  setExitOpen: Dispatch<SetStateAction<boolean>>
}) => (
  <Box>
    {[
      {
        title: '退出小区',
        color: 'info' as const,
        icon: <ExitToApp fontSize="small" />,
        onClick: () => setExitOpen(true)
      },
      {
        title: '修改',
        color: 'primary' as const,
        icon: <Edit fontSize="small" />,
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
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const { page, companyList } = useSelector((state: RootState) => state.PropertyCompanySlice)
  const [exitOpen, setExitOpen] = useState(false)
  const [dialogValue, setDialogValue] = useState<CompanyReply>()

  const columns: Column<CompanyReply>[] = [
    {
      key: 'community.id',
      headerName: '小区ID',
      align: 'center',
      renderCell: row => row.community?.id || '-'
    },
    {
      key: 'community.name',
      headerName: '小区名称',
      align: 'center',
      renderCell: row => row.community?.name || '-'
    },
    {
      key: 'community.nearbyLandmarks',
      headerName: '附近地标',
      align: 'center',
      renderCell: row => row.community?.nearbyLandmarks || '-'
    },
    {
      key: 'community.cityCode',
      headerName: '城市编码',
      align: 'center',
      renderCell: row => row.community?.cityCode || '-'
    },
    {
      key: 'community.state',
      headerName: '状态',
      align: 'center',
      renderCell: value => renderStatusChip(value)
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons({ setExitOpen })
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        companyfind({ 'page.num': page.num, 'page.size': page.size, storeId: location.state?.id })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size, location.state?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <TableList rows={companyList} columns={columns} setDialogValue={setDialogValue} />
      <ExitCell dialogValue={dialogValue} exitOpen={exitOpen} setExitOpen={setExitOpen} />
    </>
  )
}

export default memo(TableData)
