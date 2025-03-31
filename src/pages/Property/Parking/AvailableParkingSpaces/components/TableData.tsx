import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/parking/remainingParkingSpace'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.RemainingParkingSpaceSlice)
  const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(find, {}, '正在加载列表中，请稍后...')
  }, [fetchData])

  const handleActionClick = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case 'refresh':
          fetchData(find, {}, '正在加载列表中，请稍后...')
          break
      }
    },
    [fetchData]
  )

  const renderActionButtons = () =>
    [{ title: '刷新', action: 'refresh' }].map(({ title, action }) => (
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
        onClick={() => handleActionClick(action)}
      />
    ))

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnFilter
      disableAutosize
      disableColumnMenu
      disableColumnResize
      disableColumnSelector
      disableColumnSorting
      disableDensitySelector
      disableEval
      disableMultipleRowSelection
      disableRowSelectionOnClick
      disableVirtualization
      rows={list}
      columns={[
        { field: 'total', headerName: '总车位数', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'freeCount',
          headerName: '剩余车位数',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'id',
          headerName: '采集时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: () => now
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: () => renderActionButtons()
        }
      ]}
    />
  )
}

export default memo(TableData)
