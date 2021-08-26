import {
  Box,
  createStyles,
  FormGroup,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import {latoFont} from '@style/theme'
import _ from 'lodash'
import React, {FunctionComponent, useEffect} from 'react'
import {Schedule, SchedulingEvent} from '../../../types/scheduling'
import {Study} from '../../../types/types'
import ErrorDisplay from '../../widgets/ErrorDisplay'
import {MTBHeadingH2} from '../../widgets/Headings'
import {BlueButton} from '../../widgets/StyledComponents'
import CalendarIcon from '../../../assets/scheduler/calendar_icon.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#E5E5E5',
      padding: theme.spacing(6, 7, 3, 7),
    },
    intialLoginContainer: {
      backgroundColor: 'white',
      width: '166px',
      padding: theme.spacing(1.75, 1),
    },
    paragraphText: {
      fontFamily: latoFont,
      fontSize: '15px',
      lineHeight: '18px',
      '&:first-child': {
        marginBottom: theme.spacing(4),
      },
      '&:last-child': {
        fontStyle: 'italic',
      },
    },
    exampleText: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '15px',
      lineHeight: '18px',
      maxWidth: '240px',
      marginTop: theme.spacing(-0.5),
    },
    input: {
      backgroundColor: 'white',
      padding: theme.spacing(2, 1.25),
      '&:focus': {
        outline: 'none',
      },
    },
    newEventButton: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(0),
    },
    errorText: {
      color: 'red',
      fontFamily: latoFont,
      fontSize: '14px',
      marginTop: theme.spacing(0.75),
    },
    calendarIcon: {
      marginRight: theme.spacing(1),
      width: '20px',
      height: '20px',
    },
  })
)

type SessionStartTabProps = {
  schedule: Schedule
  onUpdate: Function
  study: Study
}

const SessionStartTab: FunctionComponent<SessionStartTabProps> = ({
  onUpdate,
  schedule,
  study,
}: SessionStartTabProps) => {
  const classes = useStyles()
  const [editableTextboxErrorState, setEditableTextboxErrorState] =
    React.useState(new Set<string>())

  const [localEventIdentifiers, setLocalEventIdentifiers] = React.useState<
    SchedulingEvent[]
  >([])

  useEffect(() => {
    if (!study.clientData?.events) return
    setLocalEventIdentifiers([...study.clientData.events])
  }, [study.clientData.events])

  useEffect(() => {
    checkForDuplicateEventNames()
  }, [localEventIdentifiers])

  const addEmptyEvent = () => {
    const newEvent: SchedulingEvent = {
      identifier: 'untitled',
      updateType: 'mutable',
    }
    const newEvents = [...localEventIdentifiers, newEvent]
    onUpdate(undefined, newEvents)
  }

  const updateEvent = () => {
    if (checkForDuplicateEventNames()) return
    onUpdate(undefined, localEventIdentifiers)
  }

  const checkForDuplicateEventNames = () => {
    if (!study.clientData?.events) return false
    const seenIdentifiers = new Map<string, string>()
    const errorState = new Set<string>()
    for (let i = 0; i < localEventIdentifiers.length; i++) {
      const identifier = localEventIdentifiers[i].identifier
      if (seenIdentifiers.has(identifier)) {
        errorState.add(identifier + '-' + i)
        errorState.add(seenIdentifiers.get(identifier)!)
        continue
      }
      seenIdentifiers.set(identifier, identifier + '-' + i)
    }
    setEditableTextboxErrorState(errorState)
    return errorState.size > 0
  }

  const deleteEvent = (eventIdentifier: string, index: number) => {
    const newEvents: SchedulingEvent[] = []
    const eventToDelete = `${eventIdentifier}-${index}`
    for (let i = 0; i < localEventIdentifiers.length; i++) {
      const currentEvent = localEventIdentifiers[i]
      if (eventToDelete === `${currentEvent.identifier}-${i}`) {
        continue
      }
      newEvents.push(currentEvent)
    }
    setLocalEventIdentifiers(newEvents)
    onUpdate(undefined, newEvents)
  }

  if (_.isEmpty(schedule.sessions)) {
    return (
      <Box textAlign="center" mx="auto">
        <ErrorDisplay>
          You need to create sessions before creating the schedule
        </ErrorDisplay>
      </Box>
    )
  }

  const getBorderColor = (identifier: string, index: number) => {
    return editableTextboxErrorState.has(identifier + '-' + index)
      ? 'red'
      : 'black'
  }
  const calendarIcon = (
    <img src={CalendarIcon} className={classes.calendarIcon}></img>
  )
  return (
    <Box className={classes.root}>
      <Box width="600px" mx="auto" textAlign="left">
        <p className={classes.paragraphText}>
          Sessions in a study can be scheduled to start{' '}
          <strong>after a participant logs into the study</strong> for the first
          time known as “Initial Log in” or by a <strong>calendar date</strong>{' '}
          known as “Event” that are unique to each participant. Once your study
          launches, you can specify these dates for each participant in the{' '}
          <strong>Participant Manager tab.</strong>
        </p>
        <MTBHeadingH2>How will your session(s) start? </MTBHeadingH2>
        <p className={classes.paragraphText}>
          You can add additional calendar Events and{' '}
          <strong>
            relabel <br />
            them to make it easier to reference later.
          </strong>
        </p>
        <Box display="flex" justifyContent="flex-start" mt={3}>
          <Box flexShrink={0} minWidth="200px" mr={2}>
            <>
              <Box className={classes.intialLoginContainer}>Initial_Login</Box>
              {localEventIdentifiers.map((evt, index) => (
                <Box display="block">
                  <FormGroup
                    row={true}
                    key={index}
                    style={{alignItems: 'center', marginTop: '21px'}}>
                    <input
                      key={index}
                      value={evt.identifier}
                      onChange={e => {
                        const newIdentifiers = [...localEventIdentifiers]
                        newIdentifiers[index] = {
                          ...newIdentifiers[index],
                          identifier: e.target.value,
                        }
                        setLocalEventIdentifiers(newIdentifiers)
                      }}
                      onBlur={updateEvent}
                      style={{
                        border: `1px solid ${getBorderColor(
                          evt.identifier,
                          index
                        )}`,
                      }}
                      className={classes.input}></input>
                    <IconButton
                      style={{marginLeft: '4px'}}
                      edge="end"
                      size="small"
                      onClick={() => deleteEvent(evt.identifier, index)}>
                      <DeleteIcon
                        style={{
                          color: getBorderColor(evt.identifier, index),
                        }}></DeleteIcon>
                    </IconButton>
                  </FormGroup>
                  {editableTextboxErrorState.has(
                    evt.identifier + '-' + index
                  ) && (
                    <Box className={classes.errorText}>
                      Duplicate event identifier.
                    </Box>
                  )}
                </Box>
              ))}
            </>
            <BlueButton
              disabled={editableTextboxErrorState.size > 0}
              variant="contained"
              onClick={addEmptyEvent}
              className={classes.newEventButton}>
              + New Custom Event
            </BlueButton>
          </Box>
          <Box className={classes.exampleText}>
            <Box mb={2}>
              An example Clinical Study might require 3 unique calendar events:
            </Box>
            <Box mb={1} display="flex" mr={0.5}>
              {calendarIcon}Event 1 = Baseline Visit
            </Box>
            <Box mb={1} display="flex" mr={0.5}>
              {' '}
              {calendarIcon}Event 2 = Follow-up Visit
            </Box>
            <Box display="flex"> {calendarIcon}Event 3 = Final Visit</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SessionStartTab
