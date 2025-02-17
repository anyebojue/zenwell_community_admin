import React, { Dispatch, memo, SetStateAction, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Box,
  FormLabel,
  TextField,
  Link
} from '@mui/material'
import message from 'components/Message'
import { ImportRoom } from 'api/property/houses/room'

interface ImportRoomsProps {
  openImportRoom: boolean
  setOpenImportRoom: Dispatch<SetStateAction<boolean>>
}

const ImportRooms: React.FC<ImportRoomsProps> = ({ openImportRoom, setOpenImportRoom }) => {
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      message.warning('请选择文件进行上传')
      return
    }
    const current_community = localStorage.getItem('current_community')
    const community = JSON.parse(current_community || '')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('communityId', community?.id)
    formData.append('userId', info.id)
    setLoading(true)
    try {
      await ImportRoom(formData)
      message.success('文件上传成功')
      setFile(null)
      setOpenImportRoom(false)
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openImportRoom}
      onClose={() => setOpenImportRoom(false)}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        encType: 'multipart/form-data'
      }}
    >
      <DialogTitle>房产导入</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>选择文件</FormLabel>
            <TextField
              type="file"
              sx={{ width: '80%' }}
              size="small"
              required
              onChange={handleFileChange}
              slotProps={{
                htmlInput: {
                  accept: '.xlsx,.xls' // 限制只能选择Excel文件
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>下载模板</Box>
            <Box sx={{ ml: 6.5 }}>
              请先下载
              <Link
                href="https://community-admin.zenwell.cn/files/pvdata/2025-01-07/c622b98ccb8fc29a15a91d3177d6c6b3/importRoom.xlsx"
                download
                sx={{ color: 'blue' }}
              >
                房产模板
              </Link>
              准备数据后，上传导入
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenImportRoom(false)}>
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? '导入中...' : '导入'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(ImportRooms)
