import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/parking/carInoutPayment'
import { find as findArea } from 'modules/property/parking/parkingArea'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Chip } from '@mui/material'

const stateCd: Record<string, string> = {
  '100300': '进场状态',
  '100400': '支付完成',
  '100500': '离场状态',
  '100600': '超时重新支付'
}

interface TableDataProps {
  selectedButton: string
}

const TableData: React.FC<TableDataProps> = ({ selectedButton }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CarInoutPaymentSlice)

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
    if (selectedButton) {
      fetchData(
        find,
        {
          'page.num': page.num,
          'page.size': page.size,
          ...(selectedButton && { paId: selectedButton })
        },
        '正在加载列表中，请稍后...'
      )
    } else {
      fetchData(findArea, { 'page.disable': true }, '正在加载列表中，请稍后...')
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
      rows={list}
      columns={[
        {
          field: 'id',
          headerName: '进出场编号',
          width: 200,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'stateCd',
          headerName: '车辆状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={stateCd[row.stateCd!] || '未知'} />
        },
        {
          field: 'carInout.carNum',
          headerName: '车牌号',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.carInout?.carNum
        },
        {
          field: 'carInout.inTime',
          headerName: '进场时间',
          width: 180,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.carInout?.inTime
        },
        {
          field: 'carInout.outTime',
          headerName: '出场时间',
          width: 180,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.carInout?.outTime
        },
        {
          field: 'payType',
          headerName: '收费类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'payCharge',
          headerName: '应收金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'realCharge',
          headerName: '实收金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createdAt',
          headerName: '支付时间',
          width: 180,
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
  )
}

export default memo(TableData)
