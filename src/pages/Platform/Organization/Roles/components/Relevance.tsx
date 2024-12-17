import { memo, useState } from 'react'
import { Box, Theme } from '@mui/material'
import { EmployeesReply } from 'api/model/platform/employeesModel'
import { RolesReply } from 'api/model/platform/rolesModel'
import FormSearch from './RelevanceTableFormSearch'
import RelevanceTableData from './RelevanceTableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

interface RelevanceProps {
  dialogValue: RolesReply
}

const Relevance: React.FC<RelevanceProps> = ({ dialogValue }) => {
  const [dialogEmployessValue, setDialogEmployessValue] = useState<EmployeesReply | undefined>()

  return (
    <Box sx={contentBoxStyle}>
      <FormSearch
        dialogValue={dialogValue}
        dialogEmployessValue={dialogEmployessValue}
        setDialogEmployessValue={setDialogEmployessValue}
      />
      <RelevanceTableData
        dialogValue={dialogValue}
        setDialogEmployessValue={setDialogEmployessValue}
      />
    </Box>
  )
}

export default memo(Relevance)
