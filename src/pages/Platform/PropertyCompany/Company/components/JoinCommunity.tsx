import { Dispatch, memo, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { companycreate, companyfind } from 'modules/platform/propertyCompany'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Stack
} from '@mui/material'
import message from 'components/Message'

interface JoinCommunityProps {
  openJoinCommunity: boolean
  setOpenJoinCommunity: Dispatch<SetStateAction<boolean>>
  storeId: string
}

export const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const JoinCommunity: React.FC<JoinCommunityProps> = ({
  openJoinCommunity,
  setOpenJoinCommunity,
  storeId
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)
  const [loading, setLoading] = useState(false)
  const [communityId, setCommunityId] = useState('0')

  const onJoinCommunity = async () => {
    setLoading(true)
    try {
      await dispatch(companycreate({ storeId, communityId }))
      setOpenJoinCommunity(false)
      message.success('加入成功')
      await dispatch(companyfind({ 'page.num': page.num, 'page.size': page.size }))
      setLoading(false)
    } catch (err) {
      if (err instanceof Error) message.error(err.message)
      setLoading(false)
    }
  }

  const handleCommunityChange = (event: SelectChangeEvent<string>) => {
    setCommunityId(event.target.value)
  }

  return (
    <Dialog fullWidth open={openJoinCommunity} onClose={() => setOpenJoinCommunity(false)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ margin: '10px' }}>加入小区</span>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center">
          <Typography variant="h6" sx={{ width: '20%' }}>
            开通小区
          </Typography>
          <Select fullWidth value={communityId} onChange={handleCommunityChange}>
            <MenuItem value="0" disabled>
              请选择要开通的小区
            </MenuItem>
            {list.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenJoinCommunity(false)}>
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
          onClick={onJoinCommunity}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(JoinCommunity)
