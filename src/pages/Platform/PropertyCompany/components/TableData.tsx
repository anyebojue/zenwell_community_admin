import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo } from 'modules/global'
import { find } from 'modules/platform/propertyCompany'
import { LoginTo } from 'api/login'
import { PropertyCompanyReply } from 'api/model/platform/propertyCompanyModel'
import {
  Tooltip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from '@mui/material'
import { Block, Delete, Edit, ManageAccounts, RestartAlt, Login } from '@mui/icons-material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import TableList from './TableList'
import RestrictedEntry from './RestrictedEntry'
import ResetPassword from './ResetPassword'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue?: PropertyCompanyReply
  setDialogValue: Dispatch<SetStateAction<PropertyCompanyReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  setDialogValue,
  selectedRows,
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

  const columns: Column<PropertyCompanyReply>[] = [
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'address', headerName: '地址', align: 'center' },
    { key: 'tel', headerName: '管理员', align: 'center' },
    { key: 'tel', headerName: '电话', align: 'center' },
    { key: 'storeTypeCd', headerName: '公司法人', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '成立日期', align: 'center' },
    { key: 'mapX', headerName: '地标', align: 'center' },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => (
        <Stack width={110} direction="row" flexWrap="wrap">
          {[
            {
              title: '管理小区',
              color: 'primary' as const,
              icon: <ManageAccounts fontSize="small" />,
              onClick: () => navigate('/property-company/company', { state: { id: row?.id } })
            },
            {
              title: '修改',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => setOpenDialog(true)
            },
            {
              title: '删除',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
            },
            {
              title: '登录',
              color: 'success' as const,
              icon: <Login fontSize="small" />,
              onClick: () => setOpen(true)
            },
            {
              title: '限制登录',
              color: 'warning' as const,
              icon: <Block fontSize="small" />,
              onClick: () => setRestrictOpen(true)
            },
            {
              title: '重置密码',
              color: 'info' as const,
              icon: <RestartAlt fontSize="small" />,
              onClick: () => setPasswordOpen(true)
            }
          ].map((action, index) => (
            <Tooltip title={action.title} key={index}>
              <IconButton size="small" color={action.color} onClick={action.onClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      )
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <TableList
        rows={list}
        columns={columns}
        setDialogValue={setDialogValue}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
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
        PaperProps={{
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
