import { Box } from '@mui/material'
import { RichTreeView, TreeViewBaseItem } from '@mui/x-tree-view'
import { memo } from 'react'

const Feature = () => {
  const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
    {
      id: '0',
      label: '组织',
      children: [
        {
          id: '001',
          label: '员工信息',
          children: [
            { id: '111', label: '员工信息' },
            { id: '222', label: '修改员工' },
            { id: '333', label: '添加员工' },
            { id: '444', label: '删除员工' }
          ]
        },
        { id: '002', label: '组织信息' },
        { id: '003', label: '角色权限' }
      ]
    },
    {
      id: '1',
      label: '数据',
      children: [
        { id: '011', label: '物业公司' },
        { id: '012', label: '入驻审核' },
        { id: '013', label: '周边商家' },
        { id: '014', label: '审核小区' },
        { id: '015', label: '小区信息' }
      ]
    },
    {
      id: '2',
      label: '供应商',
      children: [
        { id: '021', label: '供应商类型' },
        { id: '022', label: '供应商' },
        { id: '023', label: '优惠券' },
        { id: '024', label: '优惠券订单' }
      ]
    }
  ]

  return (
    <Box>
      <RichTreeView multiSelect checkboxSelection items={MUI_X_PRODUCTS} />
    </Box>
  )
}

export default memo(Feature)
