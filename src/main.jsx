/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux-toolkit/store/store.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'remixicon/fonts/remixicon.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
     <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
)
