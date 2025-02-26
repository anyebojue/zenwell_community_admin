import { memo, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { FeeComboMemberReply } from 'api/model/property/feeConfig/feeComboMemberModel'
import { Box, Chip, TextField } from '@mui/material'

const formatDateTime = (date: Date | string | undefined): string => {
  const validDate = date ? new Date(date) : new Date()
  const year = validDate.getFullYear()
  const month = String(validDate.getMonth() + 1).padStart(2, '0')
  const day = String(validDate.getDate()).padStart(2, '0')
  const hours = String(validDate.getHours()).padStart(2, '0')
  const minutes = String(validDate.getMinutes()).padStart(2, '0')
  const seconds = String(validDate.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

interface TableDataProps {
  list: FeeComboMemberReply[]
  formData: {
    id: string
    communityId: string
    feeTypeCdName: string
    feeName: string
    feeFlagName: string
    startTime: string
    endTime: string
  }[]
  setFormData: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        communityId: string
        feeTypeCdName: string
        feeName: string
        feeFlagName: string
        startTime: string
        endTime: string
      }[]
    >
  >
}

const statusValue: Record<string, string> = {
  '1003006': '周期性费用',
  '2006012': '一次性费用'
}

const TableData: React.FC<TableDataProps> = ({ list, formData, setFormData }) => {
  useEffect(() => {
    const updatedFormData = list.map(row => ({
      id: row.id || '',
      communityId: row.communityId || '',
      feeTypeCdName: row.feeConfig?.feeConfigType?.name || '',
      feeName: row.feeConfig?.name || '',
      feeFlagName: row.feeConfig?.feeFlag || '',
      startTime: row.feeConfig?.startTime || '',
      endTime: row.feeConfig?.endTime || ''
    }))
    setFormData(updatedFormData)
  }, [list, setFormData])

  const handleStartTimeChange = (id: string, value: string) => {
    const updatedData = formData.map(row =>
      row.id === id ? { ...row, startTime: formatDateTime(value) } : row
    )
    setFormData(updatedData)
  }

  const handleEndTimeChange = (id: string, value: string) => {
    const updatedData = formData.map(row =>
      row.id === id ? { ...row, endTime: formatDateTime(value) } : row
    )
    setFormData(updatedData)
  }

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        {
          field: 'feeTypeCdName',
          headerName: '费用类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeConfig?.feeConfigType?.name
        },
        {
          field: 'feeName',
          headerName: '费用项目',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeConfig?.name
        },
        {
          field: 'feeFlagName',
          headerName: '费用标识',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (
            <Chip label={statusValue[row.feeConfig?.feeFlag!] || '未知类型'} />
          )
        },
        {
          field: 'startTime',
          headerName: '计费起始时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          editable: true,
          renderCell: ({ row }) => (
            <Box
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TextField
                sx={{ width: '80%' }}
                size="small"
                type="datetime-local"
                value={row.feeConfig?.startTime}
                onChange={e => handleStartTimeChange(row.id!, e.target.value)}
                variant="outlined"
              />
            </Box>
          )
        },
        {
          field: 'createdAt',
          headerName: '计费结束时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          editable: true,
          renderCell: ({ row }) => (
            <Box
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TextField
                sx={{ width: '80%' }}
                size="small"
                type="datetime-local"
                value={row.feeConfig?.endTime}
                onChange={e => handleEndTimeChange(row.id!, e.target.value)}
                variant="outlined"
              />
            </Box>
          )
        }
      ]}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationMode="server"
      rowCount={list.length}
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
