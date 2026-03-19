/**
 * Point d'entrée React : monte le composant racine <App> dans le DOM.
 * StrictMode active les vérifications supplémentaires de React en développement.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
