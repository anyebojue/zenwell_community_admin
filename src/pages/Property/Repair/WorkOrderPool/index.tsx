import { memo, useState } from 'react'
import { CommunityAnnouncementReply } from 'api/model/property/communityAnnouncementModel'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

const CommunityAnnouncementIndex = () => {
  const [dialogValue, setDialogValue] = useState<CommunityAnnouncementReply>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedButton, setSelectedButton] = useState<number>(0)

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '200px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {[
            { value: 0, label: '全部' },
            { value: 1000, label: '未派单' },
            { value: 1100, label: '接单' },
            { value: 1200, label: '退单' },
            { value: 1300, label: '转单' },
            { value: 1400, label: '申请支付' },
            { value: 1500, label: '支付失败' },
            { value: 1700, label: '待评价' },
            { value: 1800, label: '电话回访' },
            { value: 1900, label: '办理完成' },
            { value: 2000, label: '未办理结单' },
            { value: 2001, label: '暂停' }
          ].map(item => (
            <Button
              key={item.value}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.value ? '#1976d2' : '#fff',
                color: selectedButton === item.value ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.value ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          <FormSearch selectedButton={selectedButton} />
          <TableData
            selectedButton={selectedButton}
            setDialogValue={setDialogValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </Box>
      </Stack>
      <Copyright />

      <FormDialog
        selectedButton={selectedButton}
        dialogValue={dialogValue}
        openDialog={openDialog}
        dialogType="edit"
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(CommunityAnnouncementIndex)
