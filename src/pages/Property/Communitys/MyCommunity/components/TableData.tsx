import { Dispatch, memo, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Edit } from '@mui/icons-material'
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
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog }) => {
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [list, setList] = useState(info.community)

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

  useEffect(() => {
    const current_community = localStorage.getItem('current_community')
    const communityData = current_community ? JSON.parse(current_community) : null
    const communityToSet = communityData
      ? info.community.find(item => item.id === communityData.id)
      : info.community[0]
    if (communityToSet) {
      setList([communityToSet])
    }
  }, [info.community])

  return <TableList rows={list} columns={columns} setDialogValue={setDialogValue} />
}

export default memo(TableData)
