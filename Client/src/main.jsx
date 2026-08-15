import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./app/Provider";
import './index.css'
// import App from './App.jsx'
import router from './app/Router'
import ServerWakeUpToast from './components/ui/ServerWakeUpToast';
import AuthInitializer from './features/auth/components/AuthInitializer';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AppProvider> 
      <ServerWakeUpToast/>
      <AuthInitializer/>
    <RouterProvider router={ router }/>
    </AppProvider>
  </StrictMode>,
)
