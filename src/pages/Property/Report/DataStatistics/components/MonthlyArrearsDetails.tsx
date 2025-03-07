import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: FeeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const modifiedFeeConfigTypeList = [{ id: '', name: '全部' }, ...FeeConfigTypeList]
  const [selectedButton, setSelectedButton] = useState<string>('')
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.QueryMonthOweDetailSlice
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
      findFeeConfigType,
      { 'page.num': page.num, 'page.size': page.size, objType: '3333', isExport: true },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          position: 'absolute',
          top: '2%',
          right: '1.5%'
        }}
      >
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
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '120px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {modifiedFeeConfigTypeList.map(item => (
            <Button
              key={item.id}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.id ? '#1976d2' : '#fff',
                color: selectedButton === item.id ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.id ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.id || '')}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.2'
              }
            }}
            localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
            disableColumnResize
            disableVirtualization={false}
            rows={list}
            columns={[
              {
                field: 'objName',
                headerName: '房屋',
                flex: 1,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'ownerName',
                headerName: '业主',
                flex: 1,
                headerAlign: 'center',
                align: 'center',
                renderCell: ({ row }) => `${row.ownerName} (${row.link})`
              },
              {
                field: 'feeName',
                headerName: '费用名称',
                flex: 1,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'curYearMonth',
                headerName: '欠费时间段',
                flex: 1,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'receivableAmount',
                headerName: '欠费金额',
                flex: 1,
                headerAlign: 'center',
                align: 'center'
              }
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
          <Typography variant="body1" sx={{ mt: 1, ml: 1 }}>
            总欠费：131.6753
          </Typography>
        </Box>
      </Stack>
    </>
  )
}

export default memo(TableData)
