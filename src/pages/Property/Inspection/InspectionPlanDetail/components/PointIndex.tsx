import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionPointReply } from 'api/model/property/spectionPointModel'
import { deletePoint, find } from 'modules/property/spectionPoint'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import AddPoint from 'pages/Property/Inspection/InspectionRoute/components/AddPoint'
import EditPoint from 'pages/Property/Inspection/InspectionRoute/components/EditPoint'
import { SpectionPlanReply } from 'api/model/property/spectionPlanModel'

interface PointIndexProps {
  dialogValue: SpectionPlanReply
}

const PointIndex: React.FC<PointIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionPointSlice)
  const [dialogPointValue, setDialogPointValue] = useState<SpectionPointReply>()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          inspectionPlanId: dialogValue.id
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
  }, [dispatch, page.num, page.size, dialogValue.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getDeleteData = useCallback(() => {
    if (dialogPointValue) {
      return dialogPointValue.id
        ? [
            {
              id: dialogPointValue.id,
              inspectionName: dialogPointValue.inspectionName || ''
            }
          ]
        : []
    }
    return []
  }, [dialogPointValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.inspectionName)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deletePoint(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            inspectionPlanId: dialogValue.id
          })
        )
        setLoading(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size, dialogValue.id]
  )

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="error"
        startIcon={<Add />}
        sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
        onClick={() => setOpenDialog(true)}
      >
        新增
      </Button>
      <DataGrid
        sx={{ mt: 2 }}
        disableRowSelectionOnClick
        disableColumnMenu
        rows={list}
        columns={[
          {
            field: 'spectionPoint.inspectionName',
            headerName: '巡检点名称',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: params => params.row.inspectionName
          },
          {
            field: 'pointObjType',
            headerName: '巡检点类型',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: params =>
              params.row.pointObjType === 1001
                ? '设备巡检'
                : params.row.pointObjType === 2002
                  ? '环境巡检'
                  : ''
          },
          {
            field: 'longitude',
            headerName: '巡检位置',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: params => {
              const { longitude, latitude } = params.row
              return (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: 1.8 }}>
                  {longitude} <br /> {latitude}
                </div>
              )
            }
          },
          {
            field: 'pointStartTime',
            headerName: '开始时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'pointEndTime',
            headerName: '结束时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'sortNumber',
            headerName: '排序',
            flex: 1,
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
              <Box key="select">
                {[
                  {
                    title: '修改',
                    color: 'secondary' as const,
                    icon: <Edit fontSize="small" />,
                    onClick: () => {
                      setOpenEditDialog(true)
                      setDialogPointValue(row)
                    }
                  },
                  {
                    title: '删除',
                    color: 'error' as const,
                    icon: <Delete fontSize="small" />,
                    onClick: () => {
                      setDelOpen(true)
                      setDialogPointValue(row)
                    }
                  }
                ].map((action, index) => (
                  <Tooltip title={action.title} key={index}>
                    <IconButton size="small" color={action.color} onClick={action.onClick}>
                      {action.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            ]
          }
        ]}
        pageSizeOptions={[20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20
            }
          }
        }}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
      <AddPoint
        dialogValue={dialogPointValue}
        routeDialogValue={dialogValue.spectionRoute || {}}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <EditPoint
        dialogValue={dialogPointValue}
        routeDialogValue={dialogValue.spectionRoute || {}}
        openDialog={openEditDialog}
        setOpenDialog={setOpenEditDialog}
      />
    </>
  )
}

export default memo(PointIndex)
