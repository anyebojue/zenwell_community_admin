export interface RemainingParkingSpaceReply {
  id?: string
  freeCount?: string
  total?: string
}

export interface FindRemainingParkingSpaceReply {
  list: Array<RemainingParkingSpaceReply>
}
