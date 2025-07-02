import React, { memo, useState, useCallback } from 'react'
import { update } from 'modules/property/houses/room'
import { Box, Button, Step, StepLabel, Stepper, Typography, styled, Theme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { StepConnector, stepConnectorClasses } from '@mui/material'
import { StepIconProps } from '@mui/material/StepIcon'
import { Add, Business, ContactEmergency, MapsHomeWork } from '@mui/icons-material'
import { FloorReply } from 'api/model/property/houses/floorModel'
import { RoomReply } from 'api/model/property/houses/roomModel'
import message from 'components/Message'
import { useLocation, useNavigate } from 'react-router-dom'
import { buttonStyles } from 'components/DeleteModal'
import { useDispatch } from 'react-redux'
import Associated from './components/Associated'

const contentBoxStyle = (theme: Theme) => ({
  mt: 2.5,
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

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
    1: <Business />,
    2: <MapsHomeWork />,
    3: <ContactEmergency />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const steps = ['选择楼栋', '选择房屋', '业主信息']

const CheckInOwner = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state?.value
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [selectfloorValue, setSelectFloorValue] = useState<FloorReply | undefined>()
  const [selectRoomValue, setSelectRoomValue] = useState<RoomReply | undefined>()
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = useCallback(() => {
    if (!selectfloorValue) return message.warning('您还没有选择楼栋')
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [selectfloorValue])

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }, [])

  const renderStepContent = useCallback(() => {
    const stepData =
      activeStep === 0
        ? [
            { label: '楼栋ID', value: selectfloorValue?.id },
            { label: '楼栋名称', value: selectfloorValue?.name },
            { label: '楼栋编号', value: selectfloorValue?.floorNum },
            { label: '楼栋面积', value: selectfloorValue?.floorArea },
            { label: '备注', value: selectfloorValue?.remark }
          ]
        : activeStep === 1
          ? [
              { label: '房屋ID', value: selectRoomValue?.id },
              { label: '房屋编号', value: selectRoomValue?.roomNum },
              { label: '单元', value: selectRoomValue?.unit?.unitNum },
              { label: '楼层', value: selectRoomValue?.layer },
              { label: '房间数', value: selectRoomValue?.section },
              { label: '户型', value: selectRoomValue?.apartment },
              { label: '建筑面积', value: selectRoomValue?.builtUpArea },
              { label: '单价', value: '元' },
              { label: '创建员工', value: selectRoomValue?.userId }
            ]
          : [
              { label: '业主ID', value: data?.id },
              { label: '名称', value: data?.name },
              { label: '性别', value: data?.sex },
              { label: '年龄', value: data?.age },
              { label: '身份证', value: data?.idCard },
              { label: '联系方式', value: data?.link },
              { label: '创建员工', value: data?.userId },
              { label: '备注', value: data?.remark }
            ]

    return (
      <Grid container spacing={2}>
        {stepData.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Typography variant="body2">
              {item.label}：{item.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    )
  }, [activeStep, selectfloorValue, selectRoomValue, data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const closeLoading = message.loading('正在加载中，请稍后...')
    const params = {
      userId: data?.id,
      state: '2003',
      id: selectRoomValue?.id,
      startTime: new Date().toISOString().split('T')[0],
      endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 25))
        .toISOString()
        .split('T')[0]
    }
    try {
      const res = await dispatch(update(params))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
      navigate(-1)
      message.success('入住成功')
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
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">楼栋信息</Typography>
          {activeStep !== steps.length - 1 && (
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setAssociatedOpen(true)}
            >
              {activeStep === 0 ? '选择楼栋' : '选择房屋'}
            </Button>
          )}
        </Box>
        <Box sx={{ pt: 2, borderTop: '1px solid #e7eaec' }}>{renderStepContent()}</Box>
      </Box>
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
      <Associated
        activeStep={activeStep}
        selectfloorValue={selectfloorValue}
        setSelectFloorValue={setSelectFloorValue}
        setSelectRoomValue={setSelectRoomValue}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
      />
    </Box>
  )
}

export default memo(CheckInOwner)
