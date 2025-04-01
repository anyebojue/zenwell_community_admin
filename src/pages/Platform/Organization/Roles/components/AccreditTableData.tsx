import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RolesGroupReply, RolesReply } from 'api/model/platform/organization/rolesModel'
import { findRolesGroup } from 'modules/platform/organization/roles'
import { Chip } from '@mui/material'
import message from 'components/Message'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'

interface AccreditTableDataProps {
  dialogValue: RolesReply
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const AccreditTableData: React.FC<AccreditTableDataProps> = ({
  dialogValue,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, rolesGroupList } = useSelector((state: RootState) => state.RolesSlice)

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
      findRolesGroup,
      {
        'page.num': page.num,
        'page.size': page.size,
        userGroupId: dialogValue.id || '9027404928166920193'
      },
      '正在加载列表中，请稍后...'
    )
  }, [dialogValue.id, fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: RolesGroupReply) => {
      switch (actionType) {
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: RolesGroupReply) =>
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
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={rolesGroupList}
      columns={[
        {
          field: 'community.id',
          headerName: '小区ID',
          flex: 1,
          renderCell: ({ row }) => row.community?.id
        },
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
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
        }
      ]}
      onRowSelectionModelChange={handleRowSelection}
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

export default memo(AccreditTableData)
