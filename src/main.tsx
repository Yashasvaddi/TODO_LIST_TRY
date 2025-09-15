import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// --- add Leaflet CSS import ---
import 'leaflet/dist/leaflet.css'

// rest of file...
const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)