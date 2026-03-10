import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FirstStepsApp } from './FirstStepsApp'
// import { MyAwsomeApp } from './MyAwsomeApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirstStepsApp />
    {/* <MyAwsomeApp /> */}
  </StrictMode>,
);
