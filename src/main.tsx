import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EventStoreProvider } from './stores/use-event-store.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventStoreProvider>
      <App />
    </EventStoreProvider>
  </StrictMode>,
)
