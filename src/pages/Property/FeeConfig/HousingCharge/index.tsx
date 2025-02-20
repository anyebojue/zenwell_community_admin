import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/housingManagement'
import { find as findRoom } from 'modules/property/houses/room'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Tab, Tabs, Theme, Typography } from '@mui/material'
import { Add, Download } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { TreeViewBaseItem } from '@mui/x-tree-view'
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
  const { page, list } = useSelector((state: RootState) => state.HousingManagementSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)
  const [dialogValue, setDialogValue] = useState<{
    id?: string
    label?: string
    roomData?: RoomReply
  }>({})

  const MUI_X_PRODUCTS: TreeViewBaseItem[] = useMemo(() => {
    return list.map(item => ({
      id: item.id || '',
      label: item.name || '',
      children: item.unit?.map(unit => {
        const roomsForUnit = roomList.filter(room => room.unitId === unit.id)
        const unitWithRooms = {
          id: unit.id || '',
          label: `${unit.unitNum}单元`,
          children: roomsForUnit.map(room => ({
            id: room.id || '',
            label: `${room.roomNum}房间`,
            roomData: room
          }))
        }
        return unitWithRooms
      })
    }))
  }, [list, roomList])

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(find, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findRoom, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.disable, page.num, page.size])

  useEffect(() => {
    if (!MUI_X_PRODUCTS || MUI_X_PRODUCTS.length === 0) {
      setDialogValue({})
    } else {
      setDialogValue(MUI_X_PRODUCTS[0]?.children?.[0]?.children?.[0] || {})
    }
  }, [MUI_X_PRODUCTS])

  const findItemById = useCallback(
    (
      items: TreeViewBaseItem[],
      targetId: string
    ): {
      id: string
      label: string
      roomData?: RoomReply
      children?: TreeViewBaseItem[]
    } | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.children?.length) {
          const foundInChildren = findItemById(item.children, targetId)
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
            defaultExpandedItems={[
              MUI_X_PRODUCTS[0]?.id || '9031315219250413569',
              MUI_X_PRODUCTS[0]?.children?.[0]?.id || '9031315219267190785'
            ]}
            selectedItems={dialogValue?.id || '9031315219283968001'}
            onSelectedItemsChange={(_, selectedItemId) => {
              if (!selectedItemId) return
              const selectedItem = findItemById(MUI_X_PRODUCTS, selectedItemId)
              if (selectedItem && selectedItem.roomData) {
                setDialogValue(selectedItem)
              }
            }}
            expansionTrigger="iconContainer"
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
              {dialogValue?.roomData?.unit?.floor?.floorNum} -{' '}
              {dialogValue?.roomData?.unit?.unitNum} - {dialogValue?.roomData?.roomNum}
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
