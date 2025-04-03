import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ParkingSpaceApplyReply } from 'api/model/property/parking/parkingSpaceApplyModel'
import { find } from 'modules/property/parking/parkingSpaceApply'
import { find as findOwner } from 'modules/property/houses/owner'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import Examine from './Examine'

const statusValue: Record<string, string> = {
  '1001': '待审核',
  '2002': '待缴费',
  '3003': '完成',
  '4004': '审核失败'
}

const statusType: Record<string, string> = {
  '9901': '家用小汽车',
  '9902': '客车',
  '9903': '货车',
  '9904': '电动车',
  '9905': '三轮车',
  '9906': '信用期车辆（1个月）'
}

interface TableDataProps {
  openDialog: boolean
  setDialogType: Dispatch<SetStateAction<string>>
  dialogValue?: ParkingSpaceApplyReply
  setDialogValue: Dispatch<SetStateAction<ParkingSpaceApplyReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  openDialog,
  setDialogType,
  dialogValue,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ParkingSpaceApplySlice)
  const [openExamine, setOpenExamine] = useState(false)

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
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    if (openDialog) {
      fetchData(findOwner, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [fetchData, openDialog, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: ParkingSpaceApplyReply) => {
      switch (actionType) {
        case 'examine':
          setDialogValue(row)
          setOpenExamine(true)
          break
        case 'edit':
          setDialogType('edit')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ParkingSpaceApplyReply) => {
    const actions = [
      { title: '审核', action: 'examine', stateCd: '1001' },
      { title: '修改', action: 'edit', stateCd: '1001' },
      { title: '删除', action: 'delete' }
    ]
    return actions
      .filter(({ stateCd }) => stateCd === undefined || String(row.stateCd) === String(stateCd))
      .map(({ title, action, stateCd }) => (
        <Chip
          key={title}
          sx={{
            cursor: 'pointer',
            marginRight: stateCd ? '-5px' : undefined,
            '& .MuiChip-label': { fontSize: '13px' }
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
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          {
            field: 'carNum',
            headerName: '车牌号',
            width: 110,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'parkingSpace.num',
            headerName: '停车位',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.parkingSpace?.num
          },
          {
            field: 'carBrand',
            headerName: '汽车品牌',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'carType',
            headerName: '车辆类型',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusType[row.carType!] || '未知状态'} />
          },
          {
            field: 'carColor',
            headerName: '颜色',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'startTime',
            headerName: '起租时间',
            width: 180,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'endTime',
            headerName: '结租时间',
            width: 180,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'applyPersonName',
            headerName: '申请人',
            width: 100,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'applyPersonLink',
            headerName: '手机号',
            width: 120,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'stateCd',
            headerName: '审核结果',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知状态'} />
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 170,
            getActions: ({ row }) => renderActionButtons(row)
          }
        ]}
        onRowSelectionModelChange={handleRowSelection}
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
      <Examine dialogValue={dialogValue} openDialog={openExamine} setOpenDialog={setOpenExamine} />
    </>
  )
}

export default memo(TableData)
