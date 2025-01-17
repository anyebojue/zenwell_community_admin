import { Close } from '@mui/icons-material'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { SpectionPointReply } from 'api/model/property/spectionPointModel'
import { SpectionRouteReply } from 'api/model/property/spectionRouteModel'
import message from 'components/Message'
import { createPoint, find } from 'modules/property/spectionPoint'
import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const textFieldStyles = {
  mt: 0.1,
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

interface AddPointProps {
  dialogValue: SpectionPointReply | undefined
  routeDialogValue: SpectionRouteReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const AddPoint: React.FC<AddPointProps> = ({
  dialogValue,
  routeDialogValue,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionPointSlice)
  const [searchText, setSearchText] = useState('')

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleSelect = async (row: SpectionPointReply) => {
    const closeLoading = message.loading('正在加载中，请稍后...')
    try {
      const current_community = localStorage.getItem('current_community')
      const community = JSON.parse(current_community || '')
      const params = {
        inspectionRouteId: routeDialogValue?.id,
        inspectionPointId: row.id,
        communityId: community.id,
        status: dialogValue?.status
      }
      const action = createPoint(params)
      const res = await dispatch(action)
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
      message.success('编辑成功')
      setOpenDialog(false)
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }

  return (
    <Dialog maxWidth="lg" open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        选择巡检点
        <IconButton onClick={() => setOpenDialog(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          placeholder="请输入巡检点名称"
          size="small"
          variant="outlined"
          sx={textFieldStyles}
          value={searchText}
          onChange={handleSearch}
        />
        <DataGrid
          sx={{ mt: 2 }}
          disableRowSelectionOnClick
          disableColumnMenu
          rows={list}
          columns={[
            {
              field: 'id',
              headerName: '巡检点ID',
              width: 250,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'inspectionName',
              headerName: '巡检点名称',
              width: 150,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'actions',
              headerName: '操作',
              type: 'actions',
              width: 100,
              headerAlign: 'center',
              align: 'center',
              getActions: ({ row }) => [
                <Button key="select" onClick={() => handleSelect(row)}>
                  选择
                </Button>
              ]
            }
          ]}
          pageSizeOptions={[25]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25
              }
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default memo(AddPoint)
