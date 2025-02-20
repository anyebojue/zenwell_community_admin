import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HousingManagementReply } from 'api/model/property/houses/housingManagementModel'
import { find } from 'modules/property/houses/housingManagement'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Tab, Tabs, Theme, Typography } from '@mui/material'
import { Add, Download } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import HousingExpenses from './components/HousingExpenses'
import CallForPayment from './components/CallForPayment'
import ReprintReceipt from './components/ReprintReceipt'
import MeterReadingRecord from './components/MeterReadingRecord'
import SecurityDeposit from './components/SecurityDeposit'
import BillingRule from './components/BillingRule'
import ExpenseStatement from './components/ExpenseStatement'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%',
  marginTop: '15px'
})

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '250px'
})

const buttonCommonStyle = (color: string = '#2660ad', height: string = '32px') => ({
  ...buttonStyles(color, '#1d428a'),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

const HousingManagementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const { list } = useSelector((state: RootState) => state.HousingManagementSlice)
  const [dialogValue, setDialogValue] = useState<HousingManagementReply>({})

  const MUI_X_PRODUCTS = useMemo(() => {
    return list.map(item => ({
      id: item.id,
      label: item.name,
      children: item.unit?.map(unit => ({
        id: unit.id,
        label: `${unit.unitNum}单元`
      }))
    }))
  }, [list])

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!list || list.length === 0) {
      setDialogValue({})
    } else {
      setDialogValue(list[0])
    }
  }, [list])

  const findItemById = useCallback(
    (items: HousingManagementReply[], targetId: string): HousingManagementReply | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.unit?.length) {
          const foundInChildren = findItemById(item.unit, targetId)
          if (foundInChildren) return foundInChildren
        }
      }
      return null
    },
    []
  )

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <RichTreeView
            items={MUI_X_PRODUCTS}
            defaultExpandedItems={['9030190676301578241']}
            selectedItems={dialogValue?.id || ''}
            onSelectedItemsChange={(_, selectedItemId) => {
              if (!selectedItemId) return
              const item = findItemById(list, selectedItemId)
              if (item) setDialogValue(item)
            }}
            expansionTrigger="iconContainer" // 只有点击左边的按钮才展开
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              backgroundColor: '#fff',
              py: 1,
              px: 2,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography component="h6" variant="h6" gutterBottom>
              {dialogValue.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonCommonStyle()}
                onClick={() => {}}
              >
                自定义模板
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonCommonStyle()}
                onClick={() => {}}
              >
                自定义导入
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonCommonStyle()}
                onClick={() => {}}
              >
                批量创建
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonCommonStyle()}
                onClick={() => {}}
              >
                批量催缴单
              </Button>
            </Stack>
          </Stack>
          <FormSearch />
          <Box sx={contentBoxStyle}>
            <Tabs
              sx={{
                border: 'none',
                boxShadow: 'none',
                '& .MuiTab-root': {
                  border: 'none',
                  boxShadow: 'none'
                },
                '& .MuiTab-root:hover': {
                  border: 'none',
                  boxShadow: 'none'
                }
              }}
              value={activeTabIndex}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab sx={{ pl: 2, pr: 2 }} label="房屋费用" value={0} />
              <Tab sx={{ pl: 2, pr: 2 }} label="催缴" value={1} />
              <Tab sx={{ pl: 2, pr: 2 }} label="补打收据" value={2} />
              <Tab sx={{ pl: 2, pr: 2 }} label="抄表记录" value={3} />
              <Tab sx={{ pl: 2, pr: 2 }} label="押金" value={4} />
              <Tab sx={{ pl: 2, pr: 2 }} label="账单规则" value={5} />
              <Tab sx={{ pl: 2, pr: 2 }} label="费用账单" value={6} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {activeTabIndex === 0 && <HousingExpenses dialogValue={dialogValue} />}
              {activeTabIndex === 1 && <CallForPayment dialogValue={dialogValue} />}
              {activeTabIndex === 2 && <ReprintReceipt dialogValue={dialogValue} />}
              {activeTabIndex === 3 && <MeterReadingRecord dialogValue={dialogValue} />}
              {activeTabIndex === 4 && <SecurityDeposit dialogValue={dialogValue} />}
              {activeTabIndex === 5 && <BillingRule dialogValue={dialogValue} />}
              {activeTabIndex === 6 && <ExpenseStatement dialogValue={dialogValue} />}
            </Box>
          </Box>
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(HousingManagementIndex)
