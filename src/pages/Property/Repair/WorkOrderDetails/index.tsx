import React, { memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RepairLogReply, RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { Box, Button, Chip, Theme, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid2'
import { Close } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

const contentBoxStyle = (theme: Theme) => ({
  mt: 2.5,
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const statusMap: Record<number, string> = {
  1000: '未派单',
  1100: '接单',
  1200: '退单',
  1300: '转单',
  1400: '申请支付',
  1500: '支付失败',
  1700: '待评价',
  1800: '电话回访',
  1900: '办理完成',
  2000: '未办理结单',
  2001: '暂停'
}

const logStatusMap: Record<number, string> = {
  10001: '处理中',
  10002: '结单',
  10003: '退单',
  10004: '转单',
  10005: '提交',
  10006: '已派单',
  10007: '已评价',
  10008: '已回访',
  10009: '待支付',
  11000: '待评价',
  12000: '已支付',
  12001: '暂停',
  12002: '到达现场'
}

const WorkOrderDetails: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentCommunity = localStorage.getItem('current_community')
  const community = JSON.parse(currentCommunity || '{}')
  const data: RepairPoolReply = location.state?.value

  const renderDetails = () => {
    const details = [
      { label: '工单编码', value: data.id },
      { label: '报修类型', value: data.repairSetting?.repairTypeName },
      { label: '报修人', value: data.repairName },
      { label: '联系方式', value: data.tel },
      { label: '位置', value: community.name },
      { label: '预约时间', value: data.appointmentTime },
      { label: '状态', value: statusMap[data.statusCd!] },
      { label: '报修内容', value: data.context }
    ]
    return details.map((item, index) => (
      <Grid key={index} size={{ md: 4 }} sx={{ my: 1 }}>
        <Box>
          {item.label}：{item.value}
        </Box>
      </Grid>
    ))
  }

  const renderImages = () => {
    return (
      <>
        {data.image?.picAfter && (
          <Box sx={contentBoxStyle}>
            <Typography variant="h6">工单图片</Typography>
            <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: '1px solid #e7eaec' }}>
              <img
                style={{ width: '200px', height: 'auto' }}
                src={data.image.picAfter}
                alt="After"
              />
            </Box>
          </Box>
        )}
        {data.image?.picBefore && (
          <Box sx={contentBoxStyle}>
            <Typography variant="h6">工单图片</Typography>
            <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: '1px solid #e7eaec' }}>
              <img
                style={{ width: '200px', height: 'auto' }}
                src={data.image.picAfter}
                alt="After"
              />
              <img
                style={{ width: '200px', height: 'auto' }}
                src={data.image.picBefore}
                alt="Before"
              />
            </Box>
          </Box>
        )}
      </>
    )
  }

  const renderLogTable = () => (
    <DataGrid
      disableRowSelectionOnClick
      disableColumnMenu
      rows={data.repairLog}
      columns={[
        { field: 'id', headerName: '序号', headerAlign: 'center', align: 'center', flex: 1 },
        {
          field: 'staffName',
          headerName: '处理人',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'statusCd',
          headerName: '状态',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }: { row: RepairLogReply }) => (
            <Chip label={logStatusMap[row.statusCd!]} />
          )
        },
        {
          field: 'startTime',
          headerName: '处理开始时间',
          width: 200,
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'endTime',
          headerName: '处理结束时间',
          width: 200,
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'startTime',
          headerName: '耗时',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }: { row: RepairLogReply }) => {
            if (!row.endTime || !row.startTime) {
              return <Chip label="无数据" />
            }
            const startTime = new Date(row.startTime)
            const endTime = new Date(row.endTime)
            const diffInMs = endTime.getTime() - startTime.getTime()
            const diffInMinutes = Math.max(0, Math.floor(diffInMs / (1000 * 60))) // 防止负值
            const hours = Math.floor(diffInMinutes / 60)
            const minutes = diffInMinutes % 60
            const label = `${hours}:${minutes.toString().padStart(2, '0')}`
            return <Chip label={label} />
          }
        },
        { field: 'context', headerName: '意见', headerAlign: 'center', align: 'center', flex: 1 }
      ]}
      pageSizeOptions={[25]}
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } }
      }}
    />
  )

  return (
    <Box>
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">工单详情</Typography>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Close />}
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
        </Box>
        <Box sx={{ mt: 2, borderTop: '1px solid #e7eaec', pt: 2 }}>
          <Grid container spacing={2}>
            {renderDetails()}
          </Grid>
        </Box>
      </Box>
      {renderImages()}
      <Box sx={contentBoxStyle}>
        <Typography variant="h6">工单流转</Typography>
        <Box sx={{ mt: 2, borderTop: '1px solid #e7eaec', pt: 2 }}>{renderLogTable()}</Box>
      </Box>
    </Box>
  )
}

export default memo(WorkOrderDetails)
