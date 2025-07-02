import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<CommunityReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1000': '审核完成'
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog }) => {
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [list, setList] = useState(info.community)

  const handleActionClick = useCallback(
    (actionType: string, row: CommunityReply) => {
      switch (actionType) {
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
      }
    },
    [setDialogValue, setOpenDialog]
  )

  const renderActionButtons = (row: CommunityReply) =>
    [{ title: '修改', action: 'edit' }].map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))

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

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'name', headerName: '小区名称', flex: 1 },
        { field: 'nearbyLandmarks', headerName: '附近地标', flex: 1 },
        { field: 'cityCode', headerName: '城市编码', flex: 1 },
        { field: 'bId', headerName: '社区编码', flex: 1 },
        {
          field: 'state',
          headerName: '状态',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }: { row: CommunityReply }) => (
            <Chip label={statusValue[row.state!] || '未知状态'} />
          )
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
        }
      ]}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationMode="server"
      rowCount={Number(list.length)}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 20
          }
        }
      }}
    />
  )
}

export default memo(TableData)
