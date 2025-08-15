import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find as findSpecification } from 'modules/property/purchase/resourceStoreSpecification'
import {
  Box,
  Button,
  Typography,
  Theme,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Select,
  MenuItem
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { ResourceStoreReply } from 'api/model/property/purchase/resourceStoreModel'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import FormSearch from './FormSearch'
import AssociatedTableData from './AssociatedTableData'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
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

const UNIT_OPTIONS: Record<string, string> = {
  '1001': '个',
  '1002': '次',
  '1003': '米',
  '1004': '台',
  '1005': '副',
  '1006': '把',
  '1007': '套',
  '1008': '平米',
  '1009': '条/次',
  '1010': '套/次',
  '1011': '个/次',
  '1012': '盒',
  '1013': '箱',
  '1014': '瓶',
  '1015': '卷',
  '1016': '张',
  '1017': '桶',
  '1018': '只',
  '1019': '支',
  '1020': '片',
  '1021': '条',
  '1022': '根',
  '1023': '块',
  '1024': '吨',
  '1025': '节',
  '1026': '件',
  '1027': '本',
  '1028': '提',
  '1029': '袋',
  '1030': '辆',
  '1031': '双',
  '1032': '公',
  '1033': '包',
  '1034': '克',
  '1035': '部',
  '1036': '匹',
  '1037': '升'
}

const contentBoxStyle = (theme: Theme) => ({
  mt: 2.5,
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

interface AssociatedProps {
  dialogValue: ResourceStoreReply[]
  setDialogValue: Dispatch<SetStateAction<ResourceStoreReply[]>>
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const Associated: React.FC<AssociatedProps> = ({
  dialogValue,
  setDialogValue,
  associatedOpen,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ResourceStoreSlice)
  const { list: storehouseList } = useSelector((state: RootState) => state.StorehouseSlice)

  const fetchData = useCallback(
    async (
      action: Function,
      params: Record<string, boolean | string | number>,
      loadingMessage: string
    ) => {
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
    fetchData(findSpecification, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData])

  return (
    <>
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">物品信息</Typography>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Search />}
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => setAssociatedOpen(true)}
          >
            选择物品
          </Button>
        </Box>
        <DataGrid
          sx={{ mt: 1 }}
          localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnResize
          disableVirtualization={false}
          rows={dialogValue}
          columns={[
            {
              field: 'resourceStoreType.name',
              headerName: '物品类型',
              width: 150,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) =>
                `${row.resourceStoreSpecification?.resourceStoreType?.storeType?.name} > ${row.resourceStoreSpecification?.resourceStoreType?.name}`
            },
            {
              field: 'resName',
              headerName: '物品名称(编号)',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => `${row.resName}(${row.resCode})`
            },
            {
              field: 'resourceStoreSpecification.specName',
              headerName: '物品规格',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => `${row.resourceStoreSpecification?.specName}`
            },
            {
              field: 'averagePrice',
              headerName: '参考价格',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => `¥${row.averagePrice}`
            },
            {
              field: 'stock',
              headerName: '物品库存',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => `${row.stock}${UNIT_OPTIONS[String(row.unitCode)]}`
            },
            {
              field: 'purchaseQuantity',
              headerName: '申请数量',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            {`${UNIT_OPTIONS[String(row.unitCode)]}`}
                          </InputAdornment>
                        )
                      }
                    }}
                    size="small"
                    type="number"
                    value={row.purchaseQuantity ?? '1'}
                    sx={textFieldStyles}
                    onChange={e => {
                      const value = e.target.value
                      setDialogValue(prev =>
                        prev.map(item =>
                          item.id === row.id ? { ...item, purchaseQuantity: value } : item
                        )
                      )
                    }}
                  />
                </Box>
              )
            },
            {
              field: 'price',
              headerName: '采购单价',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    type="number"
                    value={row.price ?? 0}
                    sx={textFieldStyles}
                    onChange={e => {
                      const value = Number(e.target.value)
                      setDialogValue(prev =>
                        prev.map(item => (item.id === row.id ? { ...item, price: value } : item))
                      )
                    }}
                  />
                </Box>
              )
            },
            {
              field: 'shId',
              headerName: '目标仓库',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Select
                    size="small"
                    value={row.shId ?? ''}
                    sx={textFieldStyles}
                    onChange={e => {
                      const value = e.target.value
                      setDialogValue(prev =>
                        prev.map(item => (item.id === row.id ? { ...item, shId: value } : item))
                      )
                    }}
                  >
                    {storehouseList.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.shName}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )
            },
            {
              field: 'purchaseRemark',
              headerName: '备注',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    value={row.purchaseRemark ?? row.remark}
                    sx={textFieldStyles}
                    onChange={e => {
                      const value = e.target.value
                      setDialogValue(prev =>
                        prev.map(item =>
                          item.id === row.id ? { ...item, purchaseRemark: value } : item
                        )
                      )
                    }}
                  />
                </Box>
              )
            },
            {
              field: 'actions',
              headerName: '操作',
              type: 'actions',
              width: 80,
              getActions: ({ row }) => [
                <Chip
                  key={row.id}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiChip-label': {
                      fontSize: '13px'
                    }
                  }}
                  label="移除"
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    setDialogValue(prev => prev.filter(item => item.id !== row.id))
                  }}
                />
              ]
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
      </Box>
      <Dialog maxWidth="md" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
        <DialogTitle>
          <FormSearch />
        </DialogTitle>
        <DialogContent>
          <AssociatedTableData setDialogValue={setDialogValue} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setAssociatedOpen(false)}>
            取消
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => setAssociatedOpen(false)}
          >
            提交
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(Associated)
