import React, { Dispatch, SetStateAction, useCallback, useState, memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  CircularProgress,
  FormLabel,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { getImportTemplate } from 'modules/property/feeConfig/payFee'

interface CustomTemplateProps {
  dialogValue: { id?: string; label?: string; roomData?: RoomReply }
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const CustomTemplate: React.FC<CustomTemplateProps> = ({ openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const feeConfigList = useSelector((state: RootState) => state.FeeConfigSlice.list)
  const floorList = useSelector((state: RootState) => state.FloorSlice.list)

  const [loading, setLoading] = useState(false)
  const [selectedFloorIds, setSelectedFloorIds] = useState<string[]>([])
  const [selectedConfigIds, setSelectedConfigIds] = useState<string[]>([])

  useEffect(() => {
    if (openDialog) {
      const loadFeeConfigs = async () => {
        const close = message.loading('正在加载列表中，请稍后...')
        try {
          const res = await dispatch(findFeeConfig({ 'page.disable': true }))
          if ('error' in res && res.error?.message) throw new Error(res.error.message)
        } catch (err) {
          message.error(err instanceof Error ? err.message : '请求出错')
        } finally {
          close()
        }
      }
      loadFeeConfigs()
    }
  }, [dispatch, openDialog])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = {
          type: '1001',
          floorIds: selectedFloorIds.join(','),
          configIds: selectedConfigIds.join(',')
        }
        const res = await dispatch(getImportTemplate(params))
        const payload = res.payload as { url?: string }
        const url = payload.url
        if ('error' in res && res.error?.message) throw new Error(res.error.message)
        if (!url) throw new Error('导出链接为空')
        const a = document.createElement('a')
        a.href = url
        a.download = ''
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        message.success('导出成功')
        setOpenDialog(false)
      } catch (err) {
        message.error(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    },
    [dispatch, selectedFloorIds, selectedConfigIds, setOpenDialog]
  )

  const toggleCheckbox = (
    id: string,
    selected: string[],
    setSelected: Dispatch<SetStateAction<string[]>>
  ) => {
    setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id])
  }

  const renderCheckboxGroup = (
    items: { id: string; name: string }[],
    selected: string[],
    setSelected: Dispatch<SetStateAction<string[]>>,
    label: string,
    labelWidth: string
  ) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FormLabel sx={{ width: labelWidth }}>{label}</FormLabel>
      <FormGroup row sx={{ flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={items.length > 0 && selected.length === items.length}
              onChange={e => setSelected(e.target.checked ? items.map(i => i.id) : [])}
            />
          }
          label="全部"
        />
        {items.map(item => (
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                checked={selected.includes(item.id)}
                onChange={() => toggleCheckbox(item.id, selected, setSelected)}
              />
            }
            label={item.name}
          />
        ))}
      </FormGroup>
    </Box>
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>模板导出</DialogTitle>
      <DialogContent dividers sx={{ mx: 1 }}>
        <Stack spacing={3}>
          {renderCheckboxGroup(
            floorList.filter(
              (item): item is { id: string; name: string } => !!item.id && !!item.name
            ),
            selectedFloorIds,
            setSelectedFloorIds,
            '楼栋：',
            '12.5%'
          )}
          {renderCheckboxGroup(
            feeConfigList.filter(
              (item): item is { id: string; name: string } => !!item.id && !!item.name
            ),
            selectedConfigIds,
            setSelectedConfigIds,
            '费用项：',
            '20%'
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenDialog(false)}>
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? '下载中...' : '下载'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(CustomTemplate)
