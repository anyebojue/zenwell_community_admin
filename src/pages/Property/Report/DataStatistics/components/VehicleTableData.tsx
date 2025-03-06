import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/report/reportFeeYearCollection'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Box, Button } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.ReportFeeYearCollectionSlice
  )

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
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, objType: '6666', isExport: true },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Download />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => {
            if (exportUrl) {
              window.open(exportUrl, '_blank')
            } else {
              alert('暂无导出链接')
            }
          }}
        >
          导出
        </Button>
      </Box>
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          { field: 'ownerName', headerName: '姓名', flex: 1 },
          { field: 'objName', headerName: '车牌号', flex: 1 },
          { field: 'ownerLink', headerName: '联系电话', flex: 1 },
          { field: 'feeTypeCdName', headerName: '收费类型', flex: 1 },
          { field: 'feeName', headerName: '费用名称', flex: 1 }
        ]}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationMode="server"
        rowCount={Number(page.total)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: Number(page.size)
            }
          }
        }}
      />
    </>
  )
}

export default memo(TableData)
