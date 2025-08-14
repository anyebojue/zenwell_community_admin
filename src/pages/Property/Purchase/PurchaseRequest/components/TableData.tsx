import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BusinessPurchaseApplyParams } from 'api/model/property/purchase/businessPurchaseApplyModel'
import { find } from 'modules/property/purchase/businessPurchaseApply'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

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

const TableData: React.FC<TableDataProps> = ({ setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.BusinessPurchaseApplySlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

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
          break
      }
    },
    [setDialogValue]
  )

  const renderActionButtons = (row: BusinessPurchaseApplyParams) => {
    const actions = [{ title: '查看', action: 'view' }]
    return actions.map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
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
          field: 'procurementResourceStores',
          headerName: '物品',
          flex: 1,
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
                {row.procurementResourceStores.map((item, index) => (
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
          field: 'resOrderType',
          headerName: '采购方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.resOrderType!] || '-'} />
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
          width: 80,
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
  )
}

export default memo(TableData)
