import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BusinessPurchaseApplyParams } from 'api/model/property/purchase/businessPurchaseApplyModel'
import { find, update } from 'modules/property/purchase/businessPurchaseApply'
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { WarningRounded } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  dialogValue?: BusinessPurchaseApplyParams
  setDialogValue: Dispatch<SetStateAction<BusinessPurchaseApplyParams | undefined>>
}

const statusCd: Record<string, string> = {
  '1000': '未审核',
  '1001': '审核中',
  '1002': '已审核',
  '1003': '完结',
  '1004': '未通过'
}

const statusValue: Record<string, string> = {
  '10000': '采购入库',
  '20000': '紧急采购'
}

const TableData: React.FC<TableDataProps> = ({ dialogValue, setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.BusinessPurchaseApplySlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = useCallback(async () => {
    setLoading(true)
    try {
      const res = await dispatch(update({ id: dialogValue?.id, stateCd: '1004' }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      setDelOpen(false)
      message.success('取消成功')
      await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
    } catch (err: unknown) {
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [dialogValue, dispatch, page.num, page.size])

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(
      find,
      {
        'page.num': page.num,
        'page.size': page.size,
        resOrderType: '10000',
        isExport: true
      },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: BusinessPurchaseApplyParams) => {
      switch (actionType) {
        case 'view':
          setDialogValue(row)
          navigate('/purchase/ApplicationInfo', { state: { value: row } })
          break
        case 'cancel':
          setDialogValue(row)
          setDelOpen(true)
          break
      }
    },
    [navigate, setDialogValue]
  )

  const renderActionButtons = (row: BusinessPurchaseApplyParams) => {
    const actions = [
      { title: '查看', action: 'view' },
      ...(row.stateCd === '1000' ? [{ title: '取消申请', action: 'cancel' }] : [])
    ]
    return actions.map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          marginRight: row.stateCd === '1000' ? '-5px' : '',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))
  }

  return (
    <>
      <DataGrid
        sx={{
          mt: 1,
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.2'
          }
        }}
        getRowHeight={() => 100}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          {
            field: 'id',
            headerName: '申请单号',
            width: 200,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'userName',
            headerName: '申请人',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'endUserName',
            headerName: '使用人',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'communityId',
            headerName: '操作人',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => community.name
          },
          {
            field: 'procurementResourceStore',
            headerName: '物品',
            flex: 3,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px 8px',
                    justifyContent: 'center'
                  }}
                >
                  {row.procurementResourceStore.map((item, index) => (
                    <Chip key={item.id} label={`${index + 1}: ${item.resName}`} size="small" />
                  ))}
                </div>
              </div>
            )
          },
          {
            field: 'createdAt',
            headerName: '申请时间',
            width: 170,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'warehousingWay',
            headerName: '采购方式',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.warehousingWay!] || '-'} />
          },
          {
            field: 'stateCd',
            headerName: '审批状态',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusCd[row.stateCd!] || '-'} />
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 150,
            getActions: ({ row }) => renderActionButtons(row)
          }
        ]}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationMode="server"
        rowCount={Number(page.total)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: Number(page.size)
            }
          }
        }}
      />
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningRounded />
          <span style={{ margin: '10px' }}>请确认您的操作!</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>确定取消申请？</DialogContentText>
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
    </>
  )
}

export default memo(TableData)
