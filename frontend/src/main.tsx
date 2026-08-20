import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { GamesProvider } from './store/GamesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GamesProvider>
        <App />
      </GamesProvider>
    </BrowserRouter>
  </StrictMode>,
)
