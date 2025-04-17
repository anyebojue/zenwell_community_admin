import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/report/queryReportFeeSummary'
import { find as findFloor } from 'modules/property/houses/floor'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  selectedButton: string
}
const TableData: React.FC<TableDataProps> = ({ selectedButton }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.QueryReportFeeSummarySlice)

  const rowList = list.map((item, index) => ({
    ...item,
    id: index + 1
  }))

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
      {
        'page.num': page.num,
        'page.size': page.size,
        ...(selectedButton && { feeTypeCd: selectedButton })
      },
      '正在加载列表中，请稍后...'
    )
    if (selectedButton === '') {
      fetchData(
        findFloor,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, selectedButton])

  return (
    <DataGrid
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        },
        mt: 1
      }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={rowList}
      columns={[
        {
          field: 'roomCount',
          headerName: '总户数',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'feeRoomCount',
          headerName: '收费户',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'oweRoomCount',
          headerName: '欠费户',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'hisOweFee+curOweFee',
          headerName: '历史欠费+当期欠费=欠费',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            `${Number(row.hisOweFee)} + ${Number(row.curOweFee)} = ${(
              Number(row.hisOweFee) + Number(row.curOweFee)
            ).toFixed(2)}`
        },
        {
          field: 'receivedFee+hisReceivedFee+preReceivedFee',
          headerName: '欠费追回+当期部分+预交=实缴',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            `${Number(row.receivedFee)} + ${Number(row.hisReceivedFee)} + ${Number(
              row.preReceivedFee
            )} = ${(
              Number(row.receivedFee) +
              Number(row.hisReceivedFee) +
              Number(row.preReceivedFee)
            ).toFixed(2)}`
        },
        {
          field: 'receivedFee',
          headerName: '当期应收',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'curReceivableFee',
          headerName: '当期实收',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: '(feeRoomCount-oweRoomCount)/feeRoomCount*100',
          headerName: '已交户/收费户=户收费率',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            `${Number(row.feeRoomCount) - Number(row.oweRoomCount)} / ${Number(row.feeRoomCount)} = ${(
              ((Number(row.feeRoomCount) - Number(row.oweRoomCount)) / Number(row.feeRoomCount)) *
              100
            ).toFixed(2)}%`
        },
        {
          field: '(curReceivableFee-curOweFee)/curReceivableFee',
          headerName: '当期实收/当期应收=收费率	',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            `${Number(row.curReceivableFee) - Number(row.curOweFee)} / ${Number(row.curReceivableFee)} = ${(
              (Number(row.curReceivableFee) - Number(row.curOweFee)) /
              Number(row.curReceivableFee)
            ).toFixed(2)}`
        },
        {
          field: 'hisReceivedFee/(hisReceivedFee+hisOweFee)*100',
          headerName: '欠费追回/(欠费追回+历史欠费)=清缴率',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            `${Number(row.hisReceivedFee)} / ${Number(row.hisReceivedFee) + Number(row.hisOweFee)} = ${(
              Number(row.hisReceivedFee) /
              (Number(row.hisReceivedFee) + Number(row.hisOweFee))
            ).toFixed(2)}`
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
  )
}

export default memo(TableData)
