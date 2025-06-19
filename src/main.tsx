import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { ItemProvider } from './Context/ItemContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ItemProvider>
      <App />
    </ItemProvider>
  </React.StrictMode>
)
