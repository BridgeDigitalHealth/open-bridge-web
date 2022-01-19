import DatePicker from '@components/widgets/DatePicker'
import {makeStyles} from '@material-ui/core'
import EventService from '@services/event.service'
import {
  ExtendedScheduleEventObject,
  TIMELINE_RETRIEVED_EVENT,
} from '@services/schedule.service'
import {ParticipantEvent} from '@typedefs/types'
import clsx from 'clsx'
import moment from 'moment'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  eventField: {
    '&>.MuiFormControl-root': {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(0, 2),

      width: '100%',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',

      justifyContent: 'space-between',

      '& >label': {
        position: 'static',
        paddingLeft: 0,
        fontWeight: 'bold',
        lineHeight: '18px',
      },
      '&>.MuiFormControl-root': {
        margin: theme.spacing(2, 0),
      },
    },
    '&$burstOrigin>.MuiFormControl-root': {
      backgroundColor: theme.palette.error.light,
    },
    '&$burstEventField': {
      backgroundColor: '#f8f8f8',
      '&>.MuiFormControl-root': {
        margin: theme.spacing(0, 2),
        padding: 0,
        width: 'auto',
      },
      '&:not(:last-child)>.MuiFormControl-root': {
        borderBottom: '1px solid #BBC3CD',
      },
    },
  },
  eventIdLabel: {
    paddingRight: '4px',
    width: '70px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&:hover': {
      overflow: 'visible',
      fontSize: '12px',
      position: 'absolute',
      width: '300px',
      zIndex: 1000,
      top: '27px',
    },
  },
  burstEventField: {},
  burstOrigin: {},
  emptyDate: {
    margin: theme.spacing(2, 0),
    height: theme.spacing(4),
    width: theme.spacing(22),
    textAlign: 'center',
    lineHeight: 2,
  },
}))

type EditParticipantEventsFormProps = {
  customParticipantEvents: ParticipantEvent[]
  scheduleEvents: ExtendedScheduleEventObject[]
  hideLoginEvent: boolean
  onChange: (p: ParticipantEvent[]) => void
}

const EventLabel: FunctionComponent<{
  eo: ExtendedScheduleEventObject
  index: number
}> = ({eo, index}) => {
  const classes = useStyles()
  const formattedEventId = EventService.formatEventIdForDisplay(eo.eventId)
  // not a burst
  if (!eo.originEventId) {
    return <div className={classes.eventIdLabel}>{formattedEventId}</div>
  }
  return (
    <div>
      {formattedEventId}:
      <br />
      <i style={{fontWeight: 'normal', fontSize: '12px'}}>
        Week {(index + 1) * (eo.interval?.value || 0)}
      </i>
    </div>
  )
}

const ReadOnlyDate: FunctionComponent<{
  eo: ExtendedScheduleEventObject
  index: number
  value?: Date | null
}> = ({eo, index, value}) => {
  const classes = useStyles()
  var displayValue = value ? new Date(value).toLocaleDateString() : '--'
  return (
    <div className="MuiFormControl-root">
      <label>
        <EventLabel eo={eo} index={index} />
      </label>
      <div className={classes.emptyDate}>{displayValue}</div>
    </div>
  )
}

const EditParticipantEventsForm: FunctionComponent<EditParticipantEventsFormProps> =
  ({customParticipantEvents, scheduleEvents, onChange, hideLoginEvent}) => {
    const classes = useStyles()

    const reCalculateBursts = (
      newBurstEvent: ParticipantEvent,
      events: ParticipantEvent[]
    ) => {
      var burstEvents = scheduleEvents.filter(
        e => e.originEventId === newBurstEvent.eventId
      )
      var newEvents = burstEvents.map(e => {
        const newEvent: ParticipantEvent = {
          eventId: e.eventId,
          timestamp: moment(newBurstEvent.timestamp!)
            .add(
              EventService.getBurstNumberFromEventId(e.eventId) *
                (e.interval?.value || 0),
              'week'
            )
            .toDate(),
        }
        return newEvent
      })
      newEvents.forEach(ne => {
        const participantEventIndex = events.findIndex(
          e => e.eventId === ne.eventId
        )
        if (participantEventIndex > -1) {
          events[participantEventIndex] = ne
        } else {
          events.push(ne)
        }
      })

      // setCustomParticipantEvents(prev => events)
      onChange(events)
    }
    function isBurstOriginEvent(eventId: string): boolean {
      return scheduleEvents.find(e => e.originEventId === eventId) !== undefined
    }

    const handleEventDateChange = (
      eventId: string,

      newDate: Date | null
    ) => {
      const newEvent: ParticipantEvent = {
        eventId: eventId,
        timestamp: newDate || undefined,
      }
      let events = [...customParticipantEvents]
      const participantEventIndex = events.findIndex(e => e.eventId === eventId)
      if (participantEventIndex > -1) {
        events[participantEventIndex] = newEvent
      } else {
        events.push(newEvent)
      }
      if (isBurstOriginEvent(eventId)) {
        reCalculateBursts(newEvent, events)
      } else {
        // setCustomParticipantEvents(prev => events)
        onChange(events)
      }
    }

    const getEventDateValue = (
      participantEvents: ParticipantEvent[] | undefined,
      currentEventId: string
    ) => {
      if (!participantEvents) {
        return null
      }
      const matchingParticipantEvent = participantEvents.find(
        pEvt => pEvt.eventId === currentEventId
      )
      if (matchingParticipantEvent) {
        return matchingParticipantEvent.timestamp || null
      }
      return null
    }

    return (
      <>
        {scheduleEvents
          .filter(e => e.originEventId === undefined)
          .map(
            (nonBurstEvent, index) =>
              (nonBurstEvent.eventId !== TIMELINE_RETRIEVED_EVENT.eventId ||
                !hideLoginEvent) && (
                <div
                  style={{marginBottom: '8px'}}
                  key={nonBurstEvent.eventId + index}>
                  <div
                    className={clsx(
                      classes.eventField,
                      isBurstOriginEvent(nonBurstEvent.eventId) &&
                        classes.burstOrigin
                    )}
                    key={nonBurstEvent.eventId}>
                    {nonBurstEvent.eventId !==
                    TIMELINE_RETRIEVED_EVENT.eventId ? (
                      <DatePicker
                        label={<EventLabel eo={nonBurstEvent} index={index} />}
                        id={nonBurstEvent.eventId}
                        value={getEventDateValue(
                          customParticipantEvents,
                          nonBurstEvent.eventId
                        )}
                        onChange={e =>
                          handleEventDateChange(nonBurstEvent.eventId, e)
                        }></DatePicker>
                    ) : isBurstOriginEvent(nonBurstEvent.eventId) ? (
                      <ReadOnlyDate
                        eo={nonBurstEvent}
                        index={index}
                        value={getEventDateValue(
                          customParticipantEvents,
                          nonBurstEvent.eventId
                        )}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  {scheduleEvents
                    .filter(e => e.originEventId === nonBurstEvent.eventId)
                    .map((burstEvent, index) => (
                      <div
                        className={clsx(
                          classes.eventField,
                          classes.burstEventField
                        )}
                        style={{}}
                        key={burstEvent.eventId}>
                        {getEventDateValue(
                          customParticipantEvents,
                          nonBurstEvent.eventId
                        ) !== null ? (
                          <DatePicker
                            label={<EventLabel eo={burstEvent} index={index} />}
                            id={burstEvent.eventId}
                            value={getEventDateValue(
                              customParticipantEvents,
                              burstEvent.eventId
                            )}
                            onChange={e =>
                              handleEventDateChange(burstEvent.eventId, e)
                            }></DatePicker>
                        ) : (
                          <ReadOnlyDate
                            eo={burstEvent}
                            index={index}
                            value={null}
                          />
                        )}
                      </div>
                    ))}
                </div>
              )
          )}
      </>
    )
  }

export default EditParticipantEventsForm