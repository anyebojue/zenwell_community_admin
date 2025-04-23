import { Dispatch, memo, SetStateAction } from 'react'
import {
  Button,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@mui/material'
import { WarningRounded } from '@mui/icons-material'

interface DeleteModalProps {
  loading: boolean
  delOpen: boolean
  setDelOpen: Dispatch<SetStateAction<boolean>>
  userName?: string[]
  onDelete: () => void
}

export const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const DeleteModal: React.FC<DeleteModalProps> = ({
  loading,
  delOpen,
  setDelOpen,
  userName,
  onDelete
}) => (
  <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
      <WarningRounded />
      <span style={{ margin: '10px' }}>删除</span>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>你确定要删除【{userName?.join('，')}】么？</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" color="error" onClick={() => setDelOpen(false)}>
        取消
      </Button>
      <Button
        variant="contained"
        type="submit"
        color="error"
        sx={buttonStyles('#2660ad', '#1d428a')}
        disabled={loading}
        startIcon={loading && <CircularProgress size={24} color="inherit" />}
        onClick={onDelete}
      >
        {loading ? '删除中...' : '确定'}
      </Button>
    </DialogActions>
  </Dialog>
)

export default memo(DeleteModal)
