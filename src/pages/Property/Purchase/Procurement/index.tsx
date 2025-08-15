import React, { memo, useState, useCallback } from 'react'
import { create } from 'modules/property/purchase/businessPurchaseApply'
import { Box, Button, Step, StepLabel, Stepper, styled } from '@mui/material'
import { StepConnector, stepConnectorClasses } from '@mui/material'
import { StepIconProps } from '@mui/material/StepIcon'
import { Discount, FmdBad, Person } from '@mui/icons-material'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import { buttonStyles } from 'components/DeleteModal'
import { useDispatch } from 'react-redux'
import { ResourceStoreReply } from 'api/model/property/purchase/resourceStoreModel'
import Associated from './components/Associated'
import ApplicationInformation from './components/ApplicationInformation'

interface ProcurementItem {
  storeId: string
  rstId: string
  resName: string
  shId: string
  rssId: string
  rsId: string
  resCode: string
  isFixed: string
  averagePrice: number
  originalStock: string
  unitCode: string
  stock: string
  quantity: string
  remark: string
  price: number
  purchaseQuantity: string
  purchaseRemark: string
  communityId: string
}

interface FormData {
  userId: string
  userName: string
  tel: string
  communityId: string
  storeId: string
  storeName: string
  employess: string
  remark: string
  resOrderType: string
  procurementResourceStores: ProcurementItem[]
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  }
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
      }
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
      }
    }
  ]
}))

const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <Discount />,
    2: <FmdBad />,
    3: <Person />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const steps = ['选择物品', '申请信息', '审批人']

const CheckInOwner = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [dialogValue, setDialogValue] = useState<ResourceStoreReply[]>([])
  const [formData, setFormData] = useState<FormData>({
    userId: community.id,
    userName: community.name,
    tel: community.tel,
    communityId: community.id,
    storeId: community.store[0].id,
    storeName: community.store[0].name,
    employess: community.store[0].userId,
    remark: '',
    resOrderType: '10000',
    procurementResourceStores: []
  })

  const handleNext = useCallback(() => {
    if (!dialogValue.length) return message.warning('您还没有选择物品')
    setFormData(prev => ({
      ...prev,
      procurementResourceStores: dialogValue.map(item => ({
        storeId: item.storeId!,
        rstId: item.rstId!,
        resName: item.resName!,
        shId: item.shId!,
        rssId: item.rssId!,
        rsId: '',
        resCode: item.resCode!,
        isFixed: item.isFixed!,
        averagePrice: item.averagePrice!,
        originalStock: item.stock!,
        unitCode: item.unitCode!,
        stock: item.stock!,
        quantity: item.miniStock!,
        remark: item.remark!,
        price: item.price!,
        purchaseQuantity: item.purchaseQuantity!,
        purchaseRemark: item.purchaseRemark!,
        communityId: community.id!
      }))
    }))
    if (activeStep !== 0 && !formData.remark) return message.warning('您还没有填申请说明')
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [activeStep, community.id, dialogValue, formData.remark])

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const closeLoading = message.loading('正在加载中，请稍后...')
    const params = { ...formData, stateCd: '1000' }
    try {
      const res = await dispatch(create(params))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
      navigate(-1)
      message.success('申请成功')
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 ? (
        <Associated
          dialogValue={dialogValue}
          setDialogValue={setDialogValue}
          associatedOpen={associatedOpen}
          setAssociatedOpen={setAssociatedOpen}
        />
      ) : (
        <ApplicationInformation
          activeStep={activeStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Button
          type="button"
          size="small"
          variant="contained"
          color="error"
          sx={{ width: '10%' }}
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          上一步
        </Button>
        <Button
          type="button"
          size="small"
          variant="contained"
          color="error"
          sx={{ width: '10%', ml: 2, ...buttonStyles('#2660ad', '#1d428a') }}
          onClick={activeStep !== steps.length - 1 ? handleNext : handleSubmit}
        >
          {activeStep !== steps.length - 1 ? '下一步' : '完成'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(CheckInOwner)
