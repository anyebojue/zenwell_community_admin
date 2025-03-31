import { memo, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CompanyReply } from 'api/model/platform/propertyCompanyModel'
import { find } from 'modules/platform/community'
import { companyfind } from 'modules/platform/propertyCompany'
import { Chip } from '@mui/material'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import ExitCell from './ExitCell'

const statusValue: Record<string, string> = {
  '': '审核成功',
  '0': '未审核'
}

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const { page, companyList } = useSelector((state: RootState) => state.PropertyCompanySlice)
  const [exitOpen, setExitOpen] = useState(false)
  const [dialogValue, setDialogValue] = useState<CompanyReply>()

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
      companyfind,
      { 'page.num': page.num, 'page.size': page.size, storeId: location.state?.id },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, location.state?.id, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: CompanyReply) => {
      switch (actionType) {
        case 'exit':
          setDialogValue(row)
          setExitOpen(true)
          break
        case 'edit':
          message.info('同步操作未实现')
          break
      }
    },
    [setExitOpen]
  )

  const renderActionButtons = (row: CompanyReply) => {
    const actions = [
      { title: '退出小区', action: 'exit' },
      { title: '修改', action: 'edit' }
    ]
    return actions.map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          marginRight: '-5px',
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
  }

  return (
    <>
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={companyList}
        columns={[
          {
            field: 'community.name',
            headerName: '小区名称',
            flex: 1,
            renderCell: ({ row }) => row.community?.name
          },
          {
            field: 'community.nearbyLandmarks',
            headerName: '附近地标',
            flex: 1,
            renderCell: ({ row }) => row.community?.nearbyLandmarks
          },
          {
            field: 'community.cityCode',
            headerName: '城市编码',
            flex: 1,
            renderCell: ({ row }) => row.community?.cityCode
          },
          {
            field: 'community.state',
            headerName: '状态',
            flex: 1,
            renderCell: ({ row }) => (
              <Chip color="success" label={statusValue[row.community?.state!] || '未知状态'} />
            )
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 300,
            getActions: ({ row }) => renderActionButtons(row)
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
      <ExitCell dialogValue={dialogValue} exitOpen={exitOpen} setExitOpen={setExitOpen} />
    </>
  )
}

export default memo(TableData)
