import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReportCustomComponentRelReply } from 'api/model/platform/reportConfiguration/reportCustomComponentRelModel'
import { find } from 'modules/platform/reportConfiguration/reportCustomComponentRel'
import { find as findCustomComponent } from 'modules/platform/reportConfiguration/reportCustomComponent'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { ReportCustomReply } from 'api/model/platform/reportConfiguration/reportCustomModel'

interface TableDataProps {
  valueData: ReportCustomReply
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ valueData, setSelectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ReportCustomComponentRelSlice)
  const { list: listCustomComponent } = useSelector(
    (state: RootState) => state.ReportCustomComponentSlice
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
      { 'page.num': page.num, 'page.size': page.size, customId: valueData.id! },
      '正在加载列表中，请稍后...'
    )
    fetchData(findCustomComponent, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size, valueData.id])

  const handleActionClick = useCallback(
    (actionType: string, row: ReportCustomComponentRelReply) => {
      switch (actionType) {
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ReportCustomComponentRelReply) =>
    [{ title: '删除', action: 'delete' }].map(({ title, action }) => (
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

  return (
    <DataGrid
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'id', headerName: '关系编号', flex: 1 },
        {
          field: 'componentId',
          headerName: '组件',
          flex: 1,
          renderCell: ({ row }) => {
            const data = listCustomComponent.filter(item => item.id === row.componentId)
            if (data.length) {
              return data[0].name
            } else {
              return ''
            }
          }
        },
        { field: 'customId', headerName: '报表编号', flex: 1 },
        { field: 'seq', headerName: '组件序号', flex: 1 },
        { field: 'createdAt', headerName: '关联时间', flex: 1 },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 150,
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
  )
}

export default memo(TableData)
