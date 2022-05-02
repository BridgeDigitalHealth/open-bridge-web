import {Box, Grid, Typography} from '@mui/material'
import {styled} from '@mui/material/styles' //vs mui/styles
import React, {FunctionComponent} from 'react'

const ProjectContainer = styled(Box)(({theme}) => ({
  backgroundPositionY: 'bottom',
  backgroundPositionX: 'right',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('lg')]: {
    //   backgroundImage: 'url(' + bgRight + ')',
    marginRight: '-200px',
    paddingRight: '200px',
  },
}))

const Project: FunctionComponent<{}> = () => {
  return (
    <ProjectContainer>
      <Typography variant="h2">Project</Typography>
      <Grid
        container
        rowSpacing={5}
        sx={{
          // backgroundImage: {lg: 'url(' + bgLeft + ')'},
          backgroundPositionY: 'bottom',
          backgroundPositionX: 'left',
          backgroundRepeat: 'no-repeat',

          marginLeft: {lg: -50},
          paddingLeft: {lg: 50},
        }}>
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography component="p">
              Mobile toolbox has a web Project for researchers and a mobile app
              Project for study participants. You don't have to have a software
              engineering team to create your own custom app.
            </Typography>
            <Typography component="p">
              Sign up is easy! Simply register for a Sage Bionetworks account to
              begin exploring today.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography component="p">
              Try out the assessments yourself with our demo app or start
              designing your own custom study through our Researcher web. You
              can customize your study schedule, assessments, and the look and
              feel of the app. Preview your study before you release it live for
              participants.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ProjectContainer>
  )
}

export default Project
