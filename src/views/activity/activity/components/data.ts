//活动详情
export interface IActivity {
  id: number
  activityKey: string
  activityName: string
  exchangeLimitDay: number
  limitType: 1 | 2
  limitValue: number
  status: number
  statusText: string
  winningCount: number
  startTime: string
  endTime: string
  prizes: IActivityPrize[]
}

//活动奖品
export interface IActivityPrize {
  id: number
  type: number
  prizeValue: string
  prizeName: string
  basePrize: boolean
  imageUrl: string
  stock: number
  limitWinningCount: number
  limitEveryday: number
  surplus: number
  probabilities: number
  level: number
  levelName: string
}
