import { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpaceReply } from 'api/model/property/houses/spaceModel'
import { VenueReply } from 'api/model/property/houses/venueModel'
import { deleteByIds, find } from 'modules/property/houses/space'
import { Box, Theme, Typography, Stack, Button, Chip } from '@mui/material'
import { Add, Delete, FileCopy } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { GridRowSelectionModel } from '@mui/x-data-grid-pro'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import SpaceFormDialog from './SpaceFormDialog'
import TimeFormDialog from './TimeFormDialog'

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
  dialogValue: VenueReply
  dialogSpaceValue: SpaceReply
  setDialogSpaceValue: Dispatch<SetStateAction<SpaceReply>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const statusValue: Record<string, string> = {
  '1': '可预约',
  '2': '不可预约'
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogSpaceValue,
  setDialogSpaceValue,
  selectedRows,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpaceSlice)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('add')
  const [openTimeDialog, setOpenTimeDialog] = useState(false)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          venueId: dialogValue.id
        })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size, dialogValue.id])

  useEffect(() => {
    if (dialogValue.id) {
      fetchData()
    }
  }, [dialogValue.id, fetchData])

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.name! }))
        .filter(item => item.id && item.name)
    }
    if (dialogSpaceValue) {
      return dialogSpaceValue.id && dialogSpaceValue.name
        ? [{ id: dialogSpaceValue.id, name: dialogSpaceValue.name }]
        : []
    }
    return []
  }, [selectedRows, list, dialogSpaceValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        fetchData()
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, fetchData]
  )

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: SpaceReply) => {
      switch (actionType) {
        case 'edit':
          setDialogType('edit')
          setDialogSpaceValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogSpaceValue, setSelectedRows]
  )

  const renderActionButtons = (row: SpaceReply) => {
    const actions = [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
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
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">场地信息</Typography>
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
              onClick={() => {
                setOpenDialog(true)
                setDialogType('add')
              }}
            >
              添加场地
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
          rows={list}
          columns={[
            {
              field: 'name',
              headerName: '名称',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'startTime',
              headerName: '开场时间',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'endTime',
              headerName: '关场时间',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'feeMoney',
              headerName: '每小时费用',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'adminName',
              headerName: '管理员',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'tel',
              headerName: '管理员电话',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'stateCd',
              headerName: '状态',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知状态'} />
            },
            {
              field: 'actions',
              headerName: '操作',
              type: 'actions',
              width: 150,
              getActions: ({ row }) => renderActionButtons(row),
              headerAlign: 'center',
              align: 'center'
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
      <SpaceFormDialog
        dialogValue={dialogValue}
        dialogSpaceValue={dialogSpaceValue}
        openDialog={openDialog}
        dialogType={dialogType}
        setOpenDialog={setOpenDialog}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
      <TimeFormDialog
        dialogSpaceValue={dialogSpaceValue}
        openDialog={openTimeDialog}
        setOpenDialog={setOpenTimeDialog}
      />
    </>
  )
}

export default memo(TableData)
