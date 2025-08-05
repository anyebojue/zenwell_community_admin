import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/repair/repairPool'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

const statusValue: Record<string, string> = {
  1000: '未派单',
  1100: '接单',
  1200: '退单',
  1300: '转单',
  1400: '申请支付',
  1500: '支付失败',
  1700: '待评价',
  1800: '电话回访',
  1900: '办理完成',
  2000: '未办理结单',
  2001: '暂停'
}

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

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
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    fetchData(
      findRepairSetting,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'id', headerName: '工单编号', flex: 1 },
        {
          field: 'communityId',
          headerName: '位置',
          flex: 1,
          renderCell: () => community.name
        },
        {
          field: 'repairSetting.repairTypeName',
          headerName: '报修类型',
          flex: 1,
          renderCell: ({ row }) => row.repairSetting?.repairTypeName
        },
        { field: 'repairName', headerName: '报修人', flex: 1 },
        { field: 'tel', headerName: '联系方式', flex: 1 },
        { field: 'appointmentTime', headerName: '预约时间', flex: 1 },
        { field: 'createdAt', headerName: '提交时间', flex: 1 },
        {
          field: 'statusCd',
          headerName: '状态',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.statusCd!] || '未知'} />
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
