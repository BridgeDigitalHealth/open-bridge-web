import React from 'react'
import {Box, makeStyles} from '@material-ui/core'
import NotifcationIcon from '../../../../assets/notification_bell_icon.svg'
import {latoFont, poppinsFont} from '../../../../style/theme'
import _ from 'lodash'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2, 3),
    fontSize: '16px',
    fontFamily: latoFont,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  colContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  textWithGrayBackground: {
    width: '100%',
    padding: theme.spacing(2, 2),
    backgroundColor: '#F8F8F8',
    lineHeight: '20px',
  },
  timeFrameText: {
    fontFamily: poppinsFont,
    fontSize: '18px',
    lineHeight: '27px',
    justifySelf: 'flex-start',
  },
  rowClose: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
}))

type ReadOnlyNotificationWindowProps = {
  index: number
  notificationHeader: string
  notificationMessage: string
  notificationTimeText: string
}

const ReadOnlyNotificationWindow: React.FunctionComponent<ReadOnlyNotificationWindowProps> = ({
  index,
  notificationHeader,
  notificationMessage,
  notificationTimeText,
}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Box className={classes.row}>
        <Box>{index}.</Box>
        <img src={NotifcationIcon}></img>
      </Box>
      <Box className={classes.row} mt={4}>
        <Box width="100px" mr={3}>
          Notification Message:
        </Box>
        <Box className={classes.colContainer}>
          <Box className={classes.textWithGrayBackground} mb={1}>
            <strong>{notificationHeader}</strong>
          </Box>
          <Box className={classes.textWithGrayBackground}>
            {notificationMessage}
          </Box>
        </Box>
      </Box>
      <Box className={classes.rowClose} mt={3}>
        <Box width="100px" mr={3}>
          Notify Participant:
        </Box>
        <strong className={classes.timeFrameText}>
          {notificationTimeText}
        </strong>
      </Box>
    </Box>
  )
}

export default ReadOnlyNotificationWindow
