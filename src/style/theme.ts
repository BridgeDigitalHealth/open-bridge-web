import { createMuiTheme, Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

type cssDict = {
  [key: string]: CSSProperties
}

export const openSansFont = [
  'Open Sans',
  'serif',
  'Lato',
  'Roboto',
  'Helvetica',
  'Arial',
].join(',')

export const playfairDisplayFont = [
  'Playfair Display',
  'serif',
  'Lato',
  'Roboto',
  'Helvetica',
  'Arial',
].join(',')

export const latoFont = ['Lato', 'Roboto', 'Helvetica', 'Arial'].join(',')

export const poppinsFont = ['Poppins', 'sans-serif'].join(',')

export type CssVariablesType = {
  shadowing: any
  testColor: string
  activeBorder: string
}

export type ThemeType = Theme & CssVariablesType

const cssVariables = {
  shadowing: {
    boxShadow: '0 2px 5px -1px rgba(0, 0, 0, 0.3)',
  },
  testColor: 'red',
  activeBorder: `1px solid #2196f3`,
}

//those are global css classes
const globals: cssDict = {
  '.assesmentContainer': {
    justifyContent: 'flex-start',
    fontSize: '26px',

    display: 'flex',
    flexWrap: 'wrap',
    overflowWrap: 'normal',
  },
}

const theme: Theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': globals,
    },
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  spacing: 8,

  typography: {
    fontSize: 12,
    h3: {
      fontFamily: poppinsFont,
      fontWeight: 600,
    },
    h4: {
      fontFamily: poppinsFont,
      fontWeight: 300,
      fontSize: '14px',
      margin: 0,
    },
    subtitle2: {
      fontFamily: playfairDisplayFont,
      fontWeight: 400,
      fontStyle: 'italic',
    },

    /*htmlFontSize: 10,
    button: {
      textTransform: 'none',
    },*/
  },

  palette: {
    divider: '#282828',
    background: {
      default: '#E5E5E5', //'#BCD5E4',
      paper: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#2A2A2A',
    },
    secondary: {
      main: '#6e818a',
    },

    primary: {
      main: '#2196f3',
    },
    error: {
      main: '#FCD2D2',
    },
  },
})

export { theme, globals, cssVariables }