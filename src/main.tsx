import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { StyledEngineProvider } from '@mui/material/styles'
import App from './layouts'
import './styles/global.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  // <StrictMode>
  <HelmetProvider>
    <StyledEngineProvider injectFirst>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
      >
        <App />
      </BrowserRouter>
    </StyledEngineProvider>
  </HelmetProvider>
  // </StrictMode>
)
