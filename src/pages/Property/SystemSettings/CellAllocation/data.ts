import { TreeViewBaseItem } from '@mui/x-tree-view'

export const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  { id: '1', label: '费用' },
  { id: '2', label: '支付宝支付' },
  { id: '3', label: '消息推送' },
  { id: '4', label: '抵扣比例' },
  { id: '5', label: '最大使用积分数' },
  { id: '6', label: '紧急采购次数' },
  { id: '7', label: '维修工单' },
  { id: '8', label: 'ICBC' },
  { id: '9', label: '退费收据开关' },
  { id: '10', label: '阿里短信' }
]

export type FormField = {
  label: string
  type: string
  id: string
  required: boolean
  text: string
}

export const FORM_FIELDS: Record<string, FormField[]> = {
  '1': [
    {
      label: '账单模式',
      type: 'text',
      id: 'billingMode',
      required: true,
      text: '说明：ON 表示账单模式，周期费用按月生成一次性费用，比如物业费会生成12条，OFF 非账单模式，周期性费用一条费用，缴费延期计费起始时间'
    },
    {
      label: '账单周期',
      type: 'text',
      id: 'billingCycle',
      required: true,
      text: '说明：正整数，月的倍数，比如1个月生成一条账单请填写1'
    },
    {
      label: '线下收银开关',
      type: 'text',
      id: 'billingCycle',
      required: true,
      text: '说明：是否禁用缴费页面提交收费按钮 2禁用，1开启'
    },
    {
      label: '收据开始编号',
      type: 'text',
      id: 'billingCycle',
      required: true,
      text: '说明：生成收据编号的开始编号，生成收据时会自动增长'
    },
    {
      label: '实收款开关',
      type: 'text',
      id: 'billingCycle',
      required: true,
      text: '说明：是否禁用实收款输入框 2禁用，1开启'
    }
  ],
  '2': [
    {
      label: 'APP_ID',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：应用id'
    },
    {
      label: '开发者私钥',
      type: 'text',
      id: 'word',
      required: true,
      text: '说明：值请填写1 开发者私钥 请填写在备注中'
    },
    {
      label: '支付宝公钥',
      type: 'text',
      id: 'word',
      required: true,
      text: '说明：值请填写1 支付宝公钥 请填写在备注中'
    },
    {
      label: '授权token',
      type: 'text',
      id: 'word',
      required: true,
      text: '说明：值请填写授权token'
    },
    {
      label: '服务商',
      type: 'text',
      id: 'word',
      required: true,
      text: '说明：值请填写ON 服务商 OFF 不是服务商，前后不要有空格'
    }
  ],
  '3': [
    {
      label: '派单企业微信url',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写 1,请填写备注中'
    }
  ],
  '4': [
    {
      label: '抵扣比例',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：积分账户抵扣比例'
    }
  ],
  '5': [
    {
      label: '最大使用积分数',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：积分账户最大使用积分数'
    }
  ],
  '6': [
    {
      label: '紧急采购次数',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写次数如 10,请填写备注中'
    }
  ],
  '7': [
    {
      label: '是否让管理员看到所有工单',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：是否让管理员看到所有工单ON 开 OFF关'
    }
  ],
  '8': [
    {
      label: 'ICBC_APP_ID',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：应用id'
    },
    {
      label: 'ICBC_PRIVATE_KEY(私钥)',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写1 私钥 请填写在备注中'
    },
    {
      label: 'ICBC_PUBLIC_KEY(公钥)',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写1 公钥 请填写在备注中'
    },
    {
      label: 'ICBC_MER_ID',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写商家ID'
    },
    {
      label: 'ICBC_MER_PRTCL_NO',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写商家ID'
    },
    {
      label: 'ICBC_APP_NAME',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：值请填写应用名称'
    },
    {
      label: 'ICBC_DECIVE_INFO',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：是设备号,能识别到的设备号，如手机设备id，浏览器的版本信息，都拿不到可以送WEB'
    }
  ],
  '9': [
    {
      label: '退费收据开关',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：退费收据开关(open 开 off 关)'
    }
  ],
  '10': [
    {
      label: 'accessKeyId',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：阿里短信accessKeyId'
    },
    {
      label: '访问秘钥',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：阿里短信访问秘钥'
    },
    {
      label: '短信签名',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：阿里短信签名'
    },
    {
      label: '区域',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：阿里短信区域，如cn-hangzhou'
    },
    {
      label: '欠费催缴模板',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：欠费催缴模板,尊敬的业主，您${house}的物业相关费用账单已生成，账单日期${date}至${date2}，缴费金额：${mount}元，请及时缴费'
    },
    {
      label: '工单通知模板',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：工单通知模板,尊敬的员工，您有一个报修单需要处理，单号为{repairId}，请您及时处理'
    },
    {
      label: '工单待处理模版',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：工单待处理模版,尊敬的员工，您有一个工单需要处理，单号为{orderId}，请您及时处理'
    },
    {
      label: '工单完成模版',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：工单通知模板,尊敬的员工，您的工单已处理完成，单号为{orderId}，请您及时查看'
    },
    {
      label: '投诉单通知模版',
      type: 'text',
      id: 'name',
      required: true,
      text: '说明：工单待处理模版,尊敬的员工，您有一个投诉单需要处理，单号为{orderId}，请您及时处理'
    }
  ]
}
