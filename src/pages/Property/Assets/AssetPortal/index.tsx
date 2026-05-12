import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetPortalIndex = () => <AssetModulePage config={assetPageConfigs.assetPortal} />

export default memo(AssetPortalIndex)
