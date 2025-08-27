/**
 * My Bill Tracker
 * @jakehayes12798
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { APP_NAME } from "./config.ts";

document.title = APP_NAME; // <-- sets tab title

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
