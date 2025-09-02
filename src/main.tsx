import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { EventStoreProvider } from './stores/use-event-store.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EventStoreProvider>
        <App />
      </EventStoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
