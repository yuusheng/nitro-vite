import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

console.log('client')
ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
