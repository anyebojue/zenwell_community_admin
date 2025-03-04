import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Print } from '@mui/icons-material'
import { Button } from '@mui/material'
import { FeeReceiptReply } from 'api/model/property/feeConfig/feeReceiptModel'
import { buttonStyles } from 'components/DeleteModal'

const Receipt = () => {
  const info = useSelector((state: RootState) => state.info.userInfo)
  const navigate = useNavigate()
  const location = useLocation()
  const { value } = location.state as { value: FeeReceiptReply }

  return (
    <div style={{ padding: '7px' }}>
      {/* 添加打印时隐藏按钮的CSS样式 */}
      <style>
        {`
        @media print {
          .print-buttons {
            display: none !important;
          }
        }
      `}
      </style>
      <div>
        <div style={{ color: 'rgb(0, 0, 0)', fontSize: '32px' }}>
          <span>缴费收据单</span>
        </div>
        <span>**************************</span>
        <div style={{ fontSize: '12px', marginLeft: '5px' }}>
          <div>
            <span>收据号：</span>
            {value?.createdAt?.split(' ')[0].replace(/-/g, '')}
          </div>
          <div>
            <span>订单号：</span>
            {value?.id}
          </div>
          <div>
            <span>房号：</span>
            {value?.feeReceiptDetail?.payFee?.payerObjName}
          </div>
          <div>
            <span>业主：</span>
            {value?.payObjName}
          </div>
          <div>
            <span>时间：</span>
            {value?.feeReceiptDetail?.payFee?.payFeeDetail?.createdAt}
          </div>
        </div>
        <span>**************************</span>
        <div style={{ fontSize: '12px', marginLeft: '5px' }}>
          <div>
            <span>收费项目：</span>
            {value?.feeReceiptDetail?.payFee?.feeConfig?.name}
          </div>
          <div>
            <span>收费范围：</span>
            {`${value?.feeReceiptDetail?.startTime} - ${value?.feeReceiptDetail?.endTime}`}
          </div>
          <div>
            <span>单价/固定费：</span>
            {value?.feeReceiptDetail?.payFee?.amount}
          </div>
          <div>
            <span>面积/用量：</span>
            {value?.feeReceiptDetail?.payFee?.consumption}
          </div>
          <div>
            <span>支付方式：</span>
            {value?.feeReceiptDetail?.payFee?.payFeeDetail?.primeRate}
          </div>
          <div>
            <span>金额：</span>
            {value?.feeReceiptDetail?.payFee?.payFeeDetail?.receivedAmount}
          </div>
          <div>
            <span>优惠金额：</span>
            {value?.feeReceiptDetail?.payFee?.payFeeDetail?.discountAmount}
          </div>
          <div>
            <span>备注：</span>
            {value?.feeReceiptDetail?.payFee?.payFeeDetail?.remark}
          </div>
        </div>
        <span>**************************</span>
        <div style={{ fontSize: '12px', marginLeft: '5px' }}>
          <div>
            <span>总计：</span>
            {value?.feeReceiptDetail?.payFee?.payFeeDetail?.receivedAmount}
          </div>
          <div>
            <span>开票人：</span>
            {info.username}
          </div>
          <div />
          <div>
            <img src="" width="100px" height="100px" alt="QR Code" />
          </div>
        </div>
        <span>**************************</span>
      </div>
      <div
        className="print-buttons"
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}
      >
        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
          取消
        </Button>
        <Button
          startIcon={<Print />}
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => window.print()}
        >
          打印
        </Button>
      </div>
    </div>
  )
}

export default Receipt
