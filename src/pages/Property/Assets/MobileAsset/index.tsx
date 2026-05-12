import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const MobileAssetIndex = () => <AssetModulePage config={assetPageConfigs.mobileAsset} />

export default memo(MobileAssetIndex)
