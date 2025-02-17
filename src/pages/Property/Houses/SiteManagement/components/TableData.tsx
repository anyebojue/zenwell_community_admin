import {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpaceReply } from 'api/model/property/houses/spaceModel'
import { deleteByIds, find } from 'modules/property/houses/space'
import { Box, Tooltip, IconButton, Theme, Typography, Stack, Button } from '@mui/material'
import { AccessTime, Add, Delete, Edit, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { VenueReply } from 'api/model/property/houses/venueModel'
import TableList from './TableList'
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

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: VenueReply
  dialogSpaceValue: SpaceReply
  setDialogSpaceValue: Dispatch<SetStateAction<SpaceReply>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
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

  const columns: Column<SpaceReply>[] = [
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'startTime', headerName: '开场时间', align: 'center' },
    { key: 'endTime', headerName: '关场时间', align: 'center' },
    { key: 'feeMoney', headerName: '每小时费用', align: 'center' },
    { key: 'adminName', headerName: '管理员', align: 'center' },
    { key: 'tel', headerName: '管理员电话', align: 'center' },
    {
      key: 'stateCd',
      headerName: '状态',
      align: 'center',
      renderCell: row => (row.stateCd === 1 ? '可预约' : row.stateCd === 2 ? '不可预约' : '')
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
            {
              title: '开放时间',
              color: 'primary' as const,
              icon: <AccessTime fontSize="small" />,
              onClick: () => setOpenTimeDialog(true)
            },
            {
              title: '修改',
              color: 'primary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => {
                setOpenDialog(true)
                setDialogType('edit')
              }
            },
            {
              title: '删除',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
            }
          ].map((action, index) => (
            <Tooltip title={action.title} key={index}>
              <IconButton size="small" color={action.color} onClick={action.onClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )
    }
  ]

  useEffect(() => {
    if (dialogValue.id) {
      fetchData()
    }
  }, [dialogValue.id, fetchData])

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
        <TableList
          rows={list}
          columns={columns}
          setDialogSpaceValue={setDialogSpaceValue}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
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
