import moment from 'moment'
import {TimelineZoomLevel, unitPixelWidth} from './types'

function getZoomLevel(scheduleDuration: string): {
  lengthInDays: number
  periods: TimelineZoomLevel[]
} {
  const periods: TimelineZoomLevel[] = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
  ]
  const duration = moment.duration(scheduleDuration)

  const lengthInDays = duration.asDays()

  if (lengthInDays < 8) {
    periods.splice(1)
  } else if (lengthInDays < 31) {
    periods.splice(2)
  } else if (lengthInDays < 92) {
    periods.splice(3)
  }
  return {lengthInDays, periods}
}

function getContainerWidth(lengthInDays: number, zoomLevel: TimelineZoomLevel) {
  return unitPixelWidth[zoomLevel] * lengthInDays
}

export default {
  getZoomLevel,
  getContainerWidth,
}
