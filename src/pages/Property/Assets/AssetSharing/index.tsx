import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetSharingIndex = () => <AssetModulePage config={assetPageConfigs.assetSharing} />

export default memo(AssetSharingIndex)
