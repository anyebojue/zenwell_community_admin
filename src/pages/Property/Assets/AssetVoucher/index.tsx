import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetVoucherIndex = () => <AssetModulePage config={assetPageConfigs.assetVoucher} />

export default memo(AssetVoucherIndex)
