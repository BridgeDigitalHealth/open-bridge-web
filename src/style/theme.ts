import { createMuiTheme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

const theme = createMuiTheme({
  spacing: 8,
  
  typography: {
    fontSize: 12,
    /*htmlFontSize: 10,
    button: {
      textTransform: 'none',
    },*/
  },

  palette: {
    text: {
      secondary: '',
    },
  },
})

type cssDict = {
  [key: string]: CSSProperties
}

const globals: cssDict = {
  '.assesmentContainer': {
    justifyContent: 'flex-start',

    display: 'flex',
    flexWrap: 'wrap',
    overflowWrap: 'normal',
  },
}

export { theme, globals }
