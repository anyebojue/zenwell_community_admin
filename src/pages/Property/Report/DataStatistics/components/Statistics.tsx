import { experimentalStyled as styled } from '@mui/material/styles'
import { Box, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useSelector } from 'react-redux'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027'
  })
}))

const Statistics = () => {
  const { list: feeList } = useSelector((state: RootState) => state.QueryFeeDataReportSlice)
  const { list: orderList } = useSelector((state: RootState) => state.QueryOrderDataReportSlice)
  const { list: inoutList } = useSelector((state: RootState) => state.QueryInoutDataReportSlice)
  const { list: othersList } = useSelector((state: RootState) => state.QueryOthersDataReportSlice)

  const STATISTICS_DATA = [
    {
      title: '费用类统计',
      data:
        feeList.length > 0
          ? feeList
          : [
              { name: '实收金额', value: '140110.55' },
              { name: '欠费金额', value: '230203.12' },
              { name: '优惠金额', value: '3525.49' },
              { name: '滞纳金', value: '0' },
              { name: '账户预存', value: '34188' },
              { name: '账户扣款', value: '1002000' },
              { name: '临时车收入', value: '0' },
              { name: '押金退款', value: '0' },
              { name: '退款订单数', value: '0' },
              { name: '退款金额', value: '0' },
              { name: '充电金额', value: '0' },
              { name: '月卡实收', value: '0' }
            ]
    },
    {
      title: '工单类统计',
      data:
        orderList.length > 0
          ? orderList
          : [
              { name: '投诉单', value: '2' },
              { name: '未完成投诉单', value: '0' },
              { name: '完成投诉单', value: '0' },
              { name: '报修单', value: '22' },
              { name: '未完成报修单', value: '19' },
              { name: '完成报修单', value: '3' },
              { name: '巡检', value: '306' },
              { name: '未完成巡检', value: '306' },
              { name: '完成巡检', value: '0' },
              { name: '保养', value: '0' },
              { name: '未完成保养', value: '0' },
              { name: '完成保养', value: '0' },
              { name: '业主反馈', value: '0' },
              { name: '充电订单', value: '0' }
            ]
    },
    {
      title: '出入统计',
      data:
        inoutList.length > 0
          ? inoutList
          : [
              { name: '进场车辆数', value: '0' },
              { name: '出场车辆数', value: '0' },
              { name: '进场人员数', value: '0' },
              { name: '人脸同步数', value: '385' },
              { name: '采购入库数', value: '892' },
              { name: '领用出库数', value: '21' },
              { name: '采购入库金额', value: '9127.9' },
              { name: '完成巡检', value: '231' },
              { name: '调拨数量', value: '2' },
              { name: '房屋装修数', value: '4' },
              { name: '物品放行', value: '0' },
              { name: '交房数量', value: '311' },
              { name: '退房数量', value: '27' },
              { name: '业主绑定', value: '302' },
              { name: '未考勤数', value: '22' }
            ]
    },
    {
      title: '其他统计',
      data:
        othersList.length > 0
          ? othersList
          : [
              { name: '场地预约数', value: '6' },
              { name: '合同数', value: '22' },
              { name: '合同资产变更', value: '2' },
              { name: '租期变更', value: '2' },
              { name: '主体变更', value: '0' },
              { name: '到期合同', value: '15' },
              { name: '车辆数', value: '0' },
              { name: '车位申请', value: '10' },
              { name: '停车券购买', value: '0' },
              { name: '停车券核销', value: '0' },
              { name: '赠送优惠券', value: '0' },
              { name: '使用优惠券', value: '0' },
              { name: '退房数量', value: '0' },
              { name: '使用积分', value: '0' }
            ]
    }
  ]

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 5, sm: 10, md: 16 }}>
        {STATISTICS_DATA.map(item => (
          <Grid size={{ xs: 2, sm: 4, md: 4 }} key={item.title}>
            <Item>
              <Typography variant="body1" fontWeight={600} fontSize={17} sx={{ mb: 1 }}>
                {item.title}
              </Typography>
              <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {item.data.map(items => (
                  <Grid size={{ xs: 2, sm: 4, md: 4 }} key={items.name}>
                    <Item sx={{ border: '1px solid hsl(210, 98%, 48%)' }}>
                      <Typography variant="body1" fontSize={13}>
                        {items.name}
                      </Typography>
                      <Typography variant="body1" fontSize={16} color="#F28A4A">
                        {items.value}
                      </Typography>
                    </Item>
                  </Grid>
                ))}
              </Grid>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Statistics
