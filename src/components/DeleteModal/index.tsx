import { Dispatch, memo, SetStateAction } from 'react'
import {
  Button,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { WarningRounded } from '@mui/icons-material'

interface DeleteModalProps {
  delOpen: boolean
  setDelOpen: Dispatch<SetStateAction<boolean>>
  userName?: string[]
  onDelete: () => void
}

const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const DeleteModal: React.FC<DeleteModalProps> = ({ delOpen, setDelOpen, userName, onDelete }) => (
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
        color="error"
        sx={buttonStyles('#2660ad', '#1d428a')}
        onClick={onDelete}
      >
        确定
      </Button>
    </DialogActions>
  </Dialog>
)

export default memo(DeleteModal)
