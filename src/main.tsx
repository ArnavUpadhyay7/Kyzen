import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LoaderWrapper } from './components/global/Loader.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoaderWrapper>
      <App />
    </LoaderWrapper>
  </StrictMode>,
)
