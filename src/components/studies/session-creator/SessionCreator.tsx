import React, { FunctionComponent, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import Fab from '@material-ui/core/Fab'

import { Assessment, Group, StudySession } from '../../../types/types'

import AssessmentSelector from './AssessmentSelector'

import actionsReducer, { Types, SessionAction } from './sessionActions'
import StudyService from '../../../services/study.service'

import SessionActionButtons from './SessionActionButtons'
import SingleSessionContainer from './SingleSessionContainer'
import { useErrorHandler } from 'react-error-boundary'

import { StudySection } from '../sections'
import NavButtons from '../NavButtons'
import { useStudy, useStudySessions } from '../../../helpers/hooks'
import NavigationPrompt from 'react-router-navigation-prompt'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    padding: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill,280px)',
    gridColumnGap: theme.spacing(2),
    gridRowGap: theme.spacing(2),
    minHeight: theme.spacing(50),
    backgroundColor: '#fff',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  sessionContainer: {
    width: '280px',
    padding: theme.spacing(2),
    backgroundColor: '#F2f2f2',
  },
  actionButtons: {
    borderTop: '1px solid black',
    backgroundColor: '#FFF',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}))

type SessionCreatorProps = {
  id: string
  section: StudySection
}

const SessionCreator: FunctionComponent<SessionCreatorProps> = ({
  section,
  id,
}: SessionCreatorProps) => {
  const classes = useStyles()

  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)
  const [hasObjectChanged, setHasObjectChanged] = useState(false)
  const { data: sessions, status, error, run, setData } = useStudySessions(id)
  const handleError = useErrorHandler()

  const sessionsUpdateFn = (action: SessionAction) => {
    const newState = actionsReducer(sessions!, action)
    setHasObjectChanged(true)
    setData(newState)
  }

  if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'PENDING') {
    return <>...loading</>
  }

  const cancelAssessmentSelector = () => {
    setIsAssessmentDialogOpen(false)
    setSelectedAssessments([])
  }

  const updateAssessmentList = (
    sessionId: string,
    assessments: Assessment[],
  ) => {
    console.log(assessments)
    sessionsUpdateFn({
      type: Types.UpdateAssessments,
      payload: { sessionId, assessments },
    })
  }

  const updateAssessments = (sessionId: string, assessments: Assessment[]) => {
    console.log('updating')
    sessionsUpdateFn({
      type: Types.UpdateAssessments,
      payload: {
        sessionId,
        assessments,
      },
    })
    setIsAssessmentDialogOpen(false)
  }

  const getActiveSession = (
    sessions: StudySession[],
  ): StudySession | undefined => {
    const session = sessions.find(session => session.active)
    return session
  }

  const save = async (url: string) => {
    const done = await StudyService.saveStudySessions(id, sessions || [])
    console.log('done')
    window.location.replace(url)
  }

  if (sessions) {
    return (
      <>
        <NavigationPrompt when={hasObjectChanged}>
          {({ onConfirm, onCancel }) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
        <Fab
          color="primary"
          onClick={() => setHasObjectChanged(false)}
          aria-label="add"
          style={{
            position: 'absolute',
            right: '30px',
            display: hasObjectChanged ? 'block' : 'none',
          }}
        >
          Save
        </Fab>
        objectChanged? {hasObjectChanged ? 'yes' : 'no'}
        <Box className={classes.root}>
          {sessions.map(session => (
            <Paper className={classes.sessionContainer} key={session.id}>
              <SingleSessionContainer
                key={session.id}
                studySession={session}
                onShowAssessments={() => setIsAssessmentDialogOpen(true)}
                onSetActiveSession={(sessionId: string) =>
                  sessionsUpdateFn({
                    type: Types.SetActiveSession,
                    payload: { sessionId },
                  })
                }
                onRemoveSession={(sessionId: string) =>
                  sessionsUpdateFn({
                    type: Types.RemoveSession,
                    payload: { sessionId },
                  })
                }
                onUpdateSessionName={(sessionId: string, sessionName: string) =>
                  sessionsUpdateFn({
                    type: Types.UpdateSessionName,
                    payload: { sessionId, sessionName },
                  })
                }
                onUpdateAssessmentList={updateAssessmentList}
              ></SingleSessionContainer>
            </Paper>
          ))}
        </Box>
        <Box className={classes.actionButtons} key="actionButtons">
          <SessionActionButtons
            key={'new_session'}
            sessions={sessions}
            onAddSession={(
              sessions: StudySession[],
              assessments: Assessment[],
            ) =>
              sessionsUpdateFn({
                type: Types.AddSession,
                payload: {
                  name: 'Session' + sessions.length.toString(),
                  assessments,
                  studyId: id,
                  active: true,
                },
              })
            }
          ></SessionActionButtons>
        </Box>
        <NavButtons
          id={id}
          currentSection={section}
          onNavigate={save}
        ></NavButtons>
        <Dialog
          maxWidth="lg"
          open={isAssessmentDialogOpen}
          onClose={cancelAssessmentSelector}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            Select assessment(s) to add to session.
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={cancelAssessmentSelector}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AssessmentSelector
              selectedAssessments={selectedAssessments}
              onUpdateAssessments={setSelectedAssessments}
              activeSession={getActiveSession(sessions!)}
            ></AssessmentSelector>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelAssessmentSelector}>Cancel</Button>

            <Button
              variant="contained"
              onClick={() => {
                updateAssessments(getActiveSession(sessions)!.id, [
                  ...getActiveSession(sessions)!.assessments,
                  ...selectedAssessments,
                ])
                setSelectedAssessments([])
              }}
            >
              {!getActiveSession(sessions)
                ? 'Please select group and session'
                : `Add  to  ${getActiveSession(sessions)?.name} `}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  } else return <>should not happen</>
}

export default SessionCreator