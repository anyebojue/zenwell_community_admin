import { memo } from 'react'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Delete, Edit, FileCopy } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: '0',
    label: 'WhiteFox物业',
    children: [
      { id: '001', label: '001小区' },
      { id: '002', label: '002小区' },
      { id: '003', label: '003小区' },
      { id: '004', label: '004小区' },
      { id: '005', label: '005小区' }
    ]
  },
  {
    id: '1',
    label: 'Zenwell物业',
    children: [
      { id: '011', label: '001小区' },
      { id: '012', label: '002小区' },
      { id: '013', label: '003小区' },
      { id: '014', label: '004小区' },
      { id: '015', label: '005小区' }
    ]
  },
  {
    id: '2',
    label: '测试物业',
    children: [
      { id: '021', label: '001小区' },
      { id: '022', label: '002小区' },
      { id: '023', label: '003小区' },
      { id: '024', label: '004小区' },
      { id: '025', label: '005小区' }
    ]
  }
]

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const InfoIndex = () => {
  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
            >
              添加
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Edit />}
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
            >
              修改
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
            >
              删除
            </Button>
          </Stack>
          <RichTreeView defaultExpandedItems={['0', '1', '2']} items={MUI_X_PRODUCTS} />
        </Box>
        <Box sx={{ width: '450%' }}>
          <FormSearch />
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">WhiteFox物业 员工</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<FileCopy />}
                  sx={buttonStyles('#2660ad', '#1d428a')}
                >
                  文档
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Add />}
                  sx={buttonStyles('#2660ad', '#1d428a')}
                >
                  关联员工
                </Button>
              </Stack>
            </Box>
            <TableData />
          </Box>
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(InfoIndex)
