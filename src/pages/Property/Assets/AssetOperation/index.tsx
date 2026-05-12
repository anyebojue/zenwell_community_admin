import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetOperationIndex = () => <AssetModulePage config={assetPageConfigs.assetOperation} />

export default memo(AssetOperationIndex)
