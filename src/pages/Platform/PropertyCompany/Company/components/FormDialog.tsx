import { Dispatch, memo, SetStateAction, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  MenuItem,
  Typography,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import message from 'components/Message'
import { useLocation } from 'react-router-dom'
import { companyfind, companyupdate } from 'modules/platform/propertyCompany'
import { CompanyReply } from 'api/model/platform/propertyCompanyModel'
import { find } from 'modules/develop/menu'

interface JoinCommunityProps {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  dialogValue?: CompanyReply
}

const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor,
  '&:hover': { backgroundColor: hoverColor }
})

const JoinCommunity: React.FC<JoinCommunityProps> = ({
  openDialog,
  setOpenDialog,
  dialogValue
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const { list } = useSelector((state: RootState) => state.MenuSlice)
  const [loading, setLoading] = useState(false)
  const [checkedMenus, setCheckedMenus] = useState<string[]>([])

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
    if (dialogValue?.menus) {
      const menuArray = dialogValue.menus.split(',')
      setCheckedMenus(menuArray)
    }
    if (openDialog) {
      fetchData(find, { 'page.disable': true }, '正在加载城市数据...')
    }
  }, [dialogValue, fetchData, openDialog])

  const handleClose = useCallback(() => {
    setOpenDialog(false)
  }, [setOpenDialog])

  const onJoinCommunity = async () => {
    if (!dialogValue) return
    setLoading(true)
    try {
      const res = await dispatch(
        companyupdate({
          id: dialogValue.id,
          storeId: dialogValue.storeId || '',
          communityId: dialogValue.communityId,
          menus: checkedMenus.join(',')
        })
      )
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
      message.success('加入成功')
      handleClose()
      await dispatch(companyfind({ storeId: location.state?.id }))
    } catch (err) {
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog fullWidth open={openDialog} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>修改小区功能</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ width: '20%' }}>
            开通小区
          </Typography>
          <Select fullWidth value={dialogValue?.community?.id} disabled>
            <MenuItem value={dialogValue?.community?.id}>
              {dialogValue?.community?.name ?? '无小区信息'}
            </MenuItem>
          </Select>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Typography variant="h6" sx={{ width: '20%' }}>
            功能
          </Typography>
          <FormGroup row sx={{ flex: 1 }}>
            {list.map(item => (
              <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={checkedMenus.includes(String(item.id))}
                    onChange={e => {
                      const id = String(item.id)
                      if (e.target.checked) {
                        setCheckedMenus(prev => [...prev, id])
                      } else {
                        setCheckedMenus(prev => prev.filter(mid => mid !== id))
                      }
                    }}
                  />
                }
                label={item.name}
              />
            ))}
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          取消
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          onClick={onJoinCommunity}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(JoinCommunity)
