import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactTogether, CroquetReact } from 'react-together'
import App from '@/App'
import "@/globals.css"

//@ts-ignore - disables croquet nasty sync overlay
// CroquetReact.App.sync = false

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactTogether
      sessionParams={{
        appId: import.meta.env['VITE_APP_ID'],
        apiKey: import.meta.env['VITE_API_KEY'],
        name: import.meta.env['VITE_SESSION_NAME'],
        password: import.meta.env['VITE_SESSION_PASSWORD'],
      }}
    >
      <App />
    </ReactTogether>
  </StrictMode>
)
