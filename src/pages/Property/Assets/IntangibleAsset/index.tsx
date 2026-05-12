import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const IntangibleAssetIndex = () => <AssetModulePage config={assetPageConfigs.intangibleAsset} />

export default memo(IntangibleAssetIndex)
