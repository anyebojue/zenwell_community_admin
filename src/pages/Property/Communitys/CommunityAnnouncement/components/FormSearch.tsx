import { ChangeEvent, memo, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityAnnouncementParams } from 'api/model/property/communityAnnouncementModel'
import { find } from 'modules/property/communityAnnouncement'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
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
  selectedButton: number
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<FormSearchProps> = ({ selectedButton, selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const { page } = useSelector((state: RootState) => state.CommunityAnnouncementSlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<CommunityAnnouncementParams>({
    title: ''
  })

  const handleInputChange =
    (field: keyof CommunityAnnouncementParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: CommunityAnnouncementParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const current_community = localStorage.getItem('current_community')
        let communityId
        if (current_community) {
          communityId = JSON.parse(current_community).id
        } else {
          communityId = info.community[0].id
        }
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            communityId,
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
    [dispatch, info.community, page.num, page.size]
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
            label="请填写公示标题"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
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
              setSearchParams({ title: '' })
              fetchData({
                title: '',
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
            onClick={() => setOpenDialog(true)}
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
        dialogType="add"
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(FormSearch)
