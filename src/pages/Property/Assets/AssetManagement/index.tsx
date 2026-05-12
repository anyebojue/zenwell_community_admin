import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetManagementIndex = () => <AssetModulePage config={assetPageConfigs.assetManagement} />

export default memo(AssetManagementIndex)
