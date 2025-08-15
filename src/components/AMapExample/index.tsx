import React, { useEffect } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'

interface AMapExampleProps {
  setLng?: React.Dispatch<React.SetStateAction<string>>
  setLat?: React.Dispatch<React.SetStateAction<string>>
  mapHeight: string
}

const AMapExample: React.FC<AMapExampleProps> = ({ setLng, setLat, mapHeight }) => {
  useEffect(() => {
    let currentMarker: AMap.Marker | null = null // 存储当前的标记引用

    AMapLoader.load({
      key: 'e3c3c3bd0abf93af95edf02b7d2f24fe', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [] // 插件列表
    })
      .then(AMap => {
        // 初始化地图
        const amap = new AMap.Map('mapContainer', {
          zoom: 15, // 初始化地图层级
          center: [112.5266, 27.91507] // 初始化地图中心点
        })

        // 地图点击事件
        amap.on('click', (event: AMap.MapsEvent) => {
          const { lng, lat } = event.lnglat // 获取点击的经纬度
          setLng && setLng(String(lng))
          setLat && setLat(String(lat))

          // 如果已有标记，先移除
          if (currentMarker) {
            amap.remove(currentMarker)
          }

          // 创建新标记
          currentMarker = new AMap.Marker({
            position: [lng, lat] // 基点位置
          })

          // 添加标记到地图
          amap.add(currentMarker)
        })
      })
      .catch(e => {
        console.log(e)
      })

    // 清理标记引用
    return () => {
      if (currentMarker) {
        currentMarker = null
      }
    }
  }, [setLat, setLng])

  return <div id="mapContainer" style={{ width: '100%', height: `${mapHeight}` }}></div>
}

export default AMapExample
