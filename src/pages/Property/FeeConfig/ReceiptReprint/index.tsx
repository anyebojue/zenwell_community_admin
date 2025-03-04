import { Print } from '@mui/icons-material'
import { Button } from '@mui/material'
import { FeeReceiptReply } from 'api/model/property/feeConfig/feeReceiptModel'
import { buttonStyles } from 'components/DeleteModal'
import { useLocation, useNavigate } from 'react-router-dom'
import convertToChineseCurrency from 'utils/convertToChineseCurrency'

const PropertyFeeReceipt = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { value } = location.state as { value: FeeReceiptReply }
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

  return (
    <div>
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
      <div style={{ textAlign: 'center', fontSize: '26px' }}>{community?.name}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '16px 20px'
        }}
      >
        <div>
          <span style={{ fontSize: '14px' }}>业主：{value?.payObjName}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '14px' }}>
            单号：{value?.createdAt?.split(' ')[0].replace(/-/g, '')}({value?.id})
          </span>
          <br />
          <span style={{ fontSize: '14px' }}>
            缴费时间：{value?.feeReceiptDetail?.payFee?.payFeeDetail?.createdAt}
          </span>
        </div>
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #000'
        }}
      >
        <thead>
          <tr>
            {[
              '编号',
              '收费项目',
              '房屋/车辆',
              '收费范围',
              '单价',
              '面积/用量',
              '支付方式',
              '金额',
              '优惠金额',
              '备注'
            ].map((header, index) => (
              <th key={index} style={{ border: '1px solid #000', padding: '8px' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {[
              value?.feeReceiptDetail?.id,
              value?.feeReceiptDetail?.payFee?.feeConfig?.name,
              value?.feeReceiptDetail?.payFee?.payerObjName,
              `${value?.feeReceiptDetail?.startTime} - ${value?.feeReceiptDetail?.endTime}`,
              value?.feeReceiptDetail?.payFee?.amount,
              value?.feeReceiptDetail?.payFee?.consumption,
              value?.feeReceiptDetail?.payFee?.payFeeDetail?.primeRate,
              value?.feeReceiptDetail?.payFee?.payFeeDetail?.receivedAmount,
              value?.feeReceiptDetail?.payFee?.payFeeDetail?.discountAmount,
              value?.feeReceiptDetail?.payFee?.payFeeDetail?.remark
            ].map((item, index) => (
              <td
                key={index}
                style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}
              >
                {item}
              </td>
            ))}
          </tr>
          <tr>
            <td
              colSpan={3}
              style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}
            >
              大写人民币（元）
            </td>
            <td
              colSpan={4}
              style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}
            >
              {convertToChineseCurrency(
                value?.feeReceiptDetail?.payFee?.payFeeDetail?.discountAmount || 0
              )}
            </td>
            <td
              colSpan={3}
              style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}
            >
              {value?.feeReceiptDetail?.payFee?.payFeeDetail?.discountAmount}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '16px 0'
        }}
      >
        {['部门负责人：', '经办人：wuxw', '财务收款：', '客户确认：'].map((label, index) => (
          <span key={index} style={{ width: '25%', fontSize: '14px' }}>
            {label}
          </span>
        ))}
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

export default PropertyFeeReceipt
