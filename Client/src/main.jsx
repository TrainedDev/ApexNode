import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./app/Provider";
import './index.css'
// import App from './App.jsx'
import router from './app/Router'
import ServerWakeUpToast from './components/ui/ServerWakeUpToast';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AppProvider> 
      <ServerWakeUpToast/>
    <RouterProvider router={ router }/>
    </AppProvider>
  </StrictMode>,
)
