import { memo, useState } from 'react'
import { styled, Stepper, Step, StepLabel, Box, Theme, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import { Add, Business, ContactEmergency, MapsHomeWork } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/roomModel'
import { useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const data = location.state?.value
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [selectfloorValue, setSelectFloorValue] = useState<HousingManagementReply | undefined>()
  const [selectUnitValue, setSelectUnitValue] = useState<RoomReply | undefined>()
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (!selectfloorValue) return message.warning('您还没有选择楼栋')
    if (activeStep < steps.length - 1) {
      setActiveStep(prevStep => {
        const nextStep = prevStep + 1
        return nextStep
      })
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => {
        const prev = prevStep - 1
        return prev
      })
    }
  }

  return (
    <Box>
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid #e7eaec'
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ width: '100%' }}
          >
            {activeStep === 0 ? (
              [
                { label: '楼栋ID', value: selectfloorValue?.id },
                { label: '楼栋名称', value: selectfloorValue?.name },
                { label: '楼栋编号', value: selectfloorValue?.floorNum },
                { label: '楼栋面积', value: selectfloorValue?.floorArea },
                { label: '备注', value: selectfloorValue?.remark }
              ].map((item, index) => (
                <Grid key={index} size={{ xs: 4, sm: 4, md: 3 }} sx={{ ml: 1 }}>
                  <Box sx={{ ml: 1 }}>
                    {item.label}：{item.value}
                  </Box>
                </Grid>
              ))
            ) : activeStep === 1 ? (
              [
                { label: '房屋ID', value: selectUnitValue?.id },
                { label: '房屋编号', value: selectUnitValue?.roomNum },
                { label: '单元', value: selectUnitValue?.unit?.unitNum },
                { label: '楼层', value: selectUnitValue?.layer },
                { label: '房间数', value: selectUnitValue?.section },
                { label: '户型', value: selectUnitValue?.apartment },
                { label: '建筑面积', value: selectUnitValue?.builtUpArea },
                { label: '单价', value: '元' },
                { label: '创建员工', value: selectUnitValue?.userId }
              ].map((item, index) => (
                <Grid key={index} size={{ xs: 4, sm: 4, md: 3 }} sx={{ ml: 1 }}>
                  <Box sx={{ ml: 1 }}>
                    {item.label}：{item.value}
                  </Box>
                </Grid>
              ))
            ) : (
              <Box sx={contentBoxStyle}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: '1px solid #e7eaec'
                  }}
                >
                  <Box>
                    <img
                      style={{ width: '200px', height: '100%' }}
                      src="http://demo.homecommunity.cn/img/noPhoto.jpg"
                      alt="Zenwell Logo"
                    />
                  </Box>
                  <Box sx={{ ml: 7 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                      {[
                        { label: '业主ID', value: data.id },
                        { label: '名称', value: data.name },
                        { label: '性别', value: data.sex },
                        { label: '年龄', value: data.age },
                        { label: '身份证', value: data.idCard },
                        { label: '联系方式', value: data.link },
                        { label: '创建员工', value: data.userId },
                        { label: '备注', value: data.remark }
                      ].map((item, index) => (
                        <Grid key={index} size={{ md: 4 }} sx={{ my: 1 }}>
                          <Box>
                            {item.label}：{item.value}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Button
          type="button"
          size="small"
          variant="contained"
          color="error"
          sx={{ width: '10%' }}
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
          onClick={handleNext}
        >
          下一步
        </Button>
      </Box>
      <Associated
        activeStep={activeStep}
        selectfloorValue={selectfloorValue}
        setSelectFloorValue={setSelectFloorValue}
        setSelectUnitValue={setSelectUnitValue}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
      />
    </Box>
  )
}

export default memo(CheckInOwner)
