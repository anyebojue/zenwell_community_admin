import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LoginTo } from 'api/login'
import { PropertyCompanyReply } from 'api/model/platform/propertyCompanyModel'
import { getUserInfo } from 'modules/global'
import { find } from 'modules/platform/propertyCompany'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Chip,
  Box
} from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import RestrictedEntry from './RestrictedEntry'
import ResetPassword from './ResetPassword'

interface TableDataProps {
  dialogValue: PropertyCompanyReply | undefined
  setDialogValue: Dispatch<SetStateAction<PropertyCompanyReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const { page, list } = useSelector((state: RootState) => state.PropertyCompanySlice)
  const [restrictOpen, setRestrictOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [open, setOpen] = useState(false)

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

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: PropertyCompanyReply) => {
      switch (actionType) {
        case 'manageAccounts':
          navigate('/property-company/company', { state: { id: row?.id } })
          break
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
        case 'login':
          setDialogValue(row)
          setOpen(true)
          break
        case 'block':
          setDialogValue(row)
          setRestrictOpen(true)
          break
        case 'restartAlt':
          setDialogValue(row)
          setPasswordOpen(true)
          break
      }
    },
    [navigate, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: PropertyCompanyReply) => {
    const actions = [
      { title: '管理小区', action: 'manageAccounts' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' },
      { title: '登录', action: 'login' },
      { title: '限制登录', action: 'block' },
      { title: '重置密码', action: 'restartAlt' }
    ]
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {actions.map(({ title, action }) => (
          <Chip
            key={title}
            sx={{
              cursor: 'pointer',
              width: 'calc(33.33% - 8px)',
              '& .MuiChip-label': {
                fontSize: '13px'
              }
            }}
            label={title}
            color="primary"
            variant="outlined"
            onClick={() => handleActionClick(action, row)}
          />
        ))}
      </Box>
    )
  }

  return (
    <>
      <DataGrid
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          { field: 'name', headerName: '物业名称', flex: 1 },
          { field: 'address', headerName: '地址', flex: 1 },
          { field: 'tel', headerName: '电话', flex: 1 },
          { field: 'storeTypeCd', headerName: '公司法人(管理员)', flex: 1 },
          { field: 'nearbyLandmarks', headerName: '成立日期', flex: 1 },
          { field: 'mapX', headerName: '地标', flex: 1 },
          { field: 'createdAt', headerName: '创建时间', width: 160 },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 300,
            getActions: ({ row }) => {
              return [renderActionButtons(row)]
            }
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
      <RestrictedEntry
        dialogValue={dialogValue}
        restrictOpen={restrictOpen}
        setRestrictOpen={setRestrictOpen}
      />
      <ResetPassword
        dialogValue={dialogValue}
        passwordOpen={passwordOpen}
        setPasswordOpen={setPasswordOpen}
      />
      <Dialog
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              const form = event.target as HTMLFormElement
              const formData = new FormData(form)
              const formJson: Record<string, string> = {}
              formData.forEach((value, key) => {
                formJson[key] = value as string
              })
              const closeLoading = message.loading('正在登录中...')
              try {
                const res = await LoginTo({
                  username: info.username,
                  password: formJson.password,
                  to: dialogValue?.tel || ''
                })
                localStorage.setItem('zenwell_token', res.token)
                closeLoading()
                message.success('登录成功')
                navigate('/')
                dispatch(getUserInfo())
              } catch (err: unknown) {
                closeLoading()
                if (err instanceof Error) message.error(err.message)
              } finally {
                closeLoading()
              }
            }
          }
        }}
      >
        <DialogTitle>密码确认</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ display: 'none' }}
            autoFocus
            required
            margin="dense"
            id="username"
            name="username"
            label="密码"
            type="text"
            fullWidth
            variant="standard"
            autoComplete="new-username"
            value={dialogValue?.tel}
          />
          <TextField
            placeholder="必填，请输入当前账号密码"
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="密码"
            type="password"
            fullWidth
            variant="standard"
            autoComplete="new-password"
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button variant="contained" color="error" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
          >
            登录
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(TableData)
