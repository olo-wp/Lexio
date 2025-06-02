import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import App from './App.jsx'
import {AuthMaster} from "./auth/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthMaster>
          <App />
      </AuthMaster>
  </StrictMode>,
)
