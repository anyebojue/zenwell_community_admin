import React, { memo, useState } from 'react'
import { Box, FormLabel, Stack, TextField, Theme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import { RichTreeView } from '@mui/x-tree-view'
import Copyright from 'layouts/components/Copyright'
import { FORM_FIELDS, MUI_X_PRODUCTS } from './data'

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '20%'
})

const CellAllocationIndex: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>('1')
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialFields = FORM_FIELDS[selectedItem] || []
    return initialFields.reduce(
      (acc, field) => {
        acc[field.id] = ''
        return acc
      },
      {} as Record<string, string>
    )
  })

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <RichTreeView
            items={MUI_X_PRODUCTS}
            selectedItems={selectedItem}
            onSelectedItemsChange={(_, itemId) => itemId && setSelectedItem(itemId)}
          />
        </Box>
        <Stack spacing={3} sx={{ width: '100%' }}>
          {(FORM_FIELDS[selectedItem] || []).map(({ label, type, id, required, text }, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 5,
                pr: 10
              }}
            >
              <FormLabel sx={{ pb: 2.5 }}>{label}：</FormLabel>
              <TextField
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id] || ''}
                onChange={e => handleInputChange(id, e.target.value)}
                helperText={text}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(CellAllocationIndex)
