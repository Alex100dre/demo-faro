import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './index.css'

import {Configuration} from "@/configuration";
import {APM} from "@/application-performance-manager/APM.ts";

const configuration = new Configuration()

const apmAppConfig = {
    name: configuration.app_name,
    version: configuration.app_version,
    environment: configuration.environment,
}

const apm = new APM(
    configuration.apm.enabled,
    apmAppConfig,
    configuration.apm.url,
)

apm.init()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
        apm={apm}
        configuration={configuration}
    />
  </React.StrictMode>,
)
