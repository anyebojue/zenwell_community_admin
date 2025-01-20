import { ChangeEvent, memo, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionTaskParams } from 'api/model/property/spectionTaskModel'
import { find } from 'modules/property/spectionTask'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { Delete, History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormDialog from './FormDialog'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid',
      borderColor: 'primary.main'
    }
  }
}

interface FormSearchProps {
  selectedButton: string
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<FormSearchProps> = ({ selectedButton, selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairSettingSlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<SpectionTaskParams>({
    actUserName: '',
    startTime: '',
    endTime: '',
    stateCd: 0
  })

  const handleInputChange =
    (field: keyof SpectionTaskParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: SpectionTaskParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...params
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
    },
    [dispatch, page.num, page.size]
  )

  const handleSearch = () => {
    fetchData(searchParams)
  }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入执行人"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.actUserName}
            onChange={handleInputChange('actUserName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请选择实际巡检开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.startTime}
            onChange={handleInputChange('startTime')}
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请选择实际巡检结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.endTime}
            onChange={handleInputChange('endTime')}
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择巡检状态"
            value={searchParams.stateCd || ''}
            onChange={handleInputChange('stateCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 1, label: '未开始' },
              { value: 2, label: '进行中' },
              { value: 3, label: '已完成' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Search />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={handleSearch}
        >
          查询
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<History />}
          sx={buttonStyles('darkgray', '#696969')}
          onClick={() => {
            setSearchParams({
              name: '',
              startTime: '',
              endTime: '',
              stateCd: 0
            })
            fetchData({
              name: '',
              startTime: '',
              endTime: '',
              stateCd: 0,
              'page.num': page.num,
              'page.size': page.size
            })
          }}
        >
          重置
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={buttonStyles('#B22222', '#8B0000')}
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
      <FormDialog
        selectedButton={selectedButton}
        openDialog={openDialog}
        dialogType="add"
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(FormSearch)
