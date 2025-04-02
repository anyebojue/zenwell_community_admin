import { ChangeEvent, memo, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarParams } from 'api/model/property/parking/ownerCarModel'
import { find } from 'modules/property/parking/ownerCar'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { Add, Delete, History, Search } from '@mui/icons-material'
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
  dialogType: string
  setDialogType: Dispatch<SetStateAction<string>>
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  selectedButton: string
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<FormSearchProps> = ({
  dialogType,
  setDialogType,
  openDialog,
  setOpenDialog,
  selectedButton,
  selectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OwnerCarSlice)
  const [searchParams, setSearchParams] = useState<OwnerCarParams>({
    carNum: '',
    stateCd: ''
  })

  const handleInputChange =
    (field: keyof OwnerCarParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: OwnerCarParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { leaseType: selectedButton }),
            ...params,
            isExport: true
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
            label="请输入车牌号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.carNum}
            onChange={handleInputChange('carNum')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择车位状态"
            value={searchParams.stateCd}
            onChange={handleInputChange('stateCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1', label: '正常' },
              { value: '3', label: '到期' },
              { value: '2', label: '无车位' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
              setSearchParams({ carNum: '', carId: '', stateCd: '' })
              fetchData({
                carNum: '',
                carId: '',
                stateCd: '',
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
            startIcon={<Add />}
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => {
              setOpenDialog(true)
              setDialogType('add')
            }}
          >
            新增
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
      </Stack>
      <FormDialog
        selectedButton={selectedButton}
        openDialog={openDialog}
        dialogType={dialogType}
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(FormSearch)
