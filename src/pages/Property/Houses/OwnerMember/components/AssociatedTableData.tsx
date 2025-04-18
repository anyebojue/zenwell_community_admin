import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerReply } from 'api/model/property/houses/ownerModel'
import { find } from 'modules/property/houses/owner'
import { Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'

interface AssociatedTableDataProps {
  setOwnerUser: Dispatch<SetStateAction<OwnerReply | undefined>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  setOwnerUser,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerSlice)

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
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: OwnerReply) => {
      switch (actionType) {
        case 'select':
          setOwnerUser(row)
          setAssociatedOpen(false)
          break
      }
    },
    [setAssociatedOpen, setOwnerUser]
  )

  const renderActionButtons = (row: OwnerReply) => {
    const actions = [{ title: '选择', action: 'select' }]
    return actions.map(({ title, action }) => (
      <Button
        key={title}
        size="small"
        variant="contained"
        color="error"
        sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
        onClick={() => handleActionClick(action, row)}
      >
        选择
      </Button>
    ))
  }

  return (
    <DataGrid
      sx={{ width: '700px', mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'name', headerName: '名称', width: 80, headerAlign: 'center', align: 'center' },
        { field: 'sex', headerName: '性别', width: 80, headerAlign: 'center', align: 'center' },
        {
          field: 'idCard',
          headerName: '身份证',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'link',
          headerName: '联系方式',
          width: 120,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'userId',
          headerName: '创建员工',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 100,
          getActions: ({ row }) => renderActionButtons(row),
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

export default memo(AssociatedTableData)
