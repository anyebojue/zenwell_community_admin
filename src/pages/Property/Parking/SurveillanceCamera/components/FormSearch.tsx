import { memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MachineParams } from 'api/model/property/parking/machineModel'
import { find } from 'modules/property/parking/machine'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'

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
}

const FormSearch: React.FC<FormSearchProps> = ({ selectedButton }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.FeeConfigSlice)

  const [searchParams, setSearchParams] = useState<MachineParams>({
    machineCode: '',
    machineName: ''
  })

  const fetchData = useCallback(
    async (params: MachineParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { feeTypeCd: selectedButton }),
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
    [dispatch, page.num, page.size, selectedButton]
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
            label="请输入设备编码"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.machineCode}
            onChange={e =>
              setSearchParams(prevData => ({ ...prevData, machineCode: e.target.value }))
            }
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入设备名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.machineName}
            onChange={e =>
              setSearchParams(prevData => ({ ...prevData, machineName: e.target.value }))
            }
          />
        </FormControl>
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
                machineCode: '',
                machineName: ''
              })
              fetchData({
                machineCode: '',
                machineName: '',
                'page.num': page.num,
                'page.size': page.size
              })
            }}
          >
            重置
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
