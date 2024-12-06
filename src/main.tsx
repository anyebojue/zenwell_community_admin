import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { StyledEngineProvider } from '@mui/material/styles'
import store from 'modules/store'
import App from './layouts'
import './styles/global.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  // <StrictMode>
  <HelmetProvider>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true
          }}
        >
          <App />
        </BrowserRouter>
      </Provider>
    </StyledEngineProvider>
  </HelmetProvider>
  // </StrictMode>
)
