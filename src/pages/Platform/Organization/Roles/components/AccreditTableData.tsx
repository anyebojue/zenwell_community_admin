import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RolesReply, RolesGroupReply } from 'api/model/platform/rolesModel'
import { findRolesGroup } from 'modules/platform/roles'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import message from 'components/Message'
import AccreditTableList from './AccreditTableList'

const renderActionButtons = ({ setDelOpen }: { setDelOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <Box>
      {[
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

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface AccreditTableDataProps {
  dialogValue: RolesReply
  dialogGroupValue: RolesGroupReply
  setDialogGroupValue: Dispatch<SetStateAction<RolesGroupReply>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const AccreditTableData: React.FC<AccreditTableDataProps> = ({
  dialogValue,
  setDialogGroupValue,
  selectedRows,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, rolesGroupList } = useSelector((state: RootState) => state.RolesSlice)

  const columns: Column<RolesGroupReply>[] = [
    {
      key: 'community.id',
      headerName: '小区ID',
      align: 'center',
      renderCell: (row: RolesGroupReply) => row?.community?.id
    },
    {
      key: 'community.name',
      headerName: '小区名称',
      align: 'center',
      renderCell: (row: RolesGroupReply) => row?.community?.name
    },
    {
      key: 'community.nearbyLandmarks',
      headerName: '附近地标',
      align: 'center',
      renderCell: (row: RolesGroupReply) => row?.community?.nearbyLandmarks
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons({ setDelOpen })
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      await dispatch(
        findRolesGroup({
          'page.num': page.num,
          'page.size': page.size,
          userGroupId: dialogValue.id || '9027404928166920193'
        })
      )
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size, dialogValue.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <AccreditTableList
      rows={rolesGroupList}
      columns={columns}
      setDialogGroupValue={setDialogGroupValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(AccreditTableData)
