import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/feeConfig/reportOweFee'
import { find as findFloor } from 'modules/property/houses/floor'
import { find as findUnit } from 'modules/property/houses/unit'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Box, Typography } from '@mui/material'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list, sum, allSum } = useSelector((state: RootState) => state.ReportOweFeeSlice)

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
      { 'page.num': page.num, 'page.size': page.size, is_export: true },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findFloor,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findUnit,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findFeeConfig,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <>
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          {
            field: 'payerObjName',
            headerName: '收费对象',
            headerAlign: 'center',
            align: 'center',
            flex: 1
          },
          {
            field: 'ownerName',
            headerName: '业主名称',
            headerAlign: 'center',
            align: 'center',
            flex: 1
          },
          {
            field: 'ownerTel',
            headerName: '手机号',
            headerAlign: 'center',
            align: 'center',
            flex: 1
          },
          {
            field: 'endTime',
            headerName: '开始时间',
            headerAlign: 'center',
            align: 'center',
            flex: 1
          },
          {
            field: 'deadlineTime',
            headerName: '结束时间',
            headerAlign: 'center',
            align: 'center',
            flex: 1
          },
          {
            field: 'amountOwed',
            headerName: '合计（单位：元）',
            headerAlign: 'center',
            align: 'center',
            flex: 1
          },
          {
            field: 'updatedAt',
            headerName: '更新时间',
            headerAlign: 'center',
            align: 'center',
            flex: 1
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
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
        <Typography variant="body1">小计 合计: {sum} 元</Typography>
        <Typography variant="body1">大计 合计: {allSum} 元</Typography>
      </Box>
    </>
  )
}

export default memo(TableData)
