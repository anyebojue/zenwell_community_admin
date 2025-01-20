declare namespace AMap {
  interface MapOptions {
    zoom: number
    center: LngLat
  }

  interface Marker {
    setPosition(lnglat: LngLat): void
  }

  interface LngLat {
    lng: number
    lat: number
  }

  interface MapsEvent {
    lnglat: LngLat
  }

  class Map {
    constructor(id: string, options: MapOptions)
    on(event: string, callback: Function): void
    add(marker: Marker): void
    remove(marker: Marker): void
  }

  class Marker {
    constructor(options: { position: LngLat })
    setPosition(position: LngLat): void
  }
}
