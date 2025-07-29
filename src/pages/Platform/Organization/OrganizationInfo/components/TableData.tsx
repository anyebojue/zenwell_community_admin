import { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  OrganizationInfoReply,
  OrgUserReply
} from 'api/model/platform/organization/organizationInfoModel'
import { deleteOrgUserByIds, findOrgUser } from 'modules/platform/organization/organizationInfo'
import { Box, Theme, Typography, Stack, Button, Chip } from '@mui/material'
import { Add, Delete, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { useNavigate } from 'react-router-dom'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const buttonCommonStyle = (
  color: string = '#2660ad',
  colorActive: string = '#1d428a',
  height: string = '32px'
) => ({
  ...buttonStyles(color, colorActive),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

interface TableDataProps {
  dialogValue: OrganizationInfoReply
  dialogUserValue: OrgUserReply
  setDialogUserValue: Dispatch<SetStateAction<OrgUserReply>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogUserValue,
  selectedRows,
  setSelectedRows,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
      findOrgUser,
      {
        'page.num': page.num,
        'page.size': page.size,
        orgId: dialogValue.id || '9027438861059358721'
      },
      '正在加载列表中，请稍后...'
    )
  }, [dialogValue.id, fetchData, page.num, page.size])

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return orgUserList
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.users?.username! }))
        .filter(item => item.id && item.name)
    }
    if (dialogUserValue) {
      return dialogUserValue.id && dialogUserValue.users?.username
        ? [{ id: dialogUserValue.id, name: dialogUserValue.users?.username }]
        : []
    }
    return []
  }, [selectedRows, orgUserList, dialogUserValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteOrgUserByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        fetchData(
          findOrgUser,
          {
            'page.num': page.num,
            'page.size': page.size,
            orgId: dialogValue.id || '9027438861059358721'
          },
          '正在加载列表中，请稍后...'
        )
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dialogValue.id, dispatch, fetchData, page.num, page.size]
  )

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: OrgUserReply) => {
      switch (actionType) {
        case 'details':
          navigate('/organization/EmployeesDetails', { state: { value: row.users } })
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [navigate, setSelectedRows]
  )

  const renderActionButtons = (row: OrgUserReply) =>
    [
      { title: '详情', action: 'details' },
      { title: '删除', action: 'delete' }
    ].map(({ title, action }) => (
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

  return (
    <>
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{dialogValue.name} 员工</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<FileCopy />}
              sx={buttonCommonStyle()}
            >
              文档
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonCommonStyle()}
              onClick={() => setAssociatedOpen(true)}
            >
              关联员工
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={buttonCommonStyle('#B22222', '#8B0000')}
              onClick={() => {
                if (![...selectedRows].length) {
                  return message.warning('请选择至少一项')
                }
                setDelOpen(true)
              }}
            >
              批量删除
            </Button>
          </Stack>
        </Box>
        <DataGrid
          sx={{ mt: 1 }}
          localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnResize
          disableVirtualization={false}
          checkboxSelection
          rows={orgUserList}
          columns={[
            {
              field: 'users.username',
              headerName: '名称',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => row.users?.username
            },
            {
              field: 'users.mobile',
              headerName: '手机号',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => row.users?.mobile
            },
            {
              field: 'users.position',
              headerName: '岗位',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => row.users?.position
            },
            {
              field: 'users.address',
              headerName: '地址',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => row.users?.address
            },
            {
              field: 'users.sex',
              headerName: '性别',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => row.users?.sex
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
      </Box>
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
    </>
  )
}

export default memo(TableData)
