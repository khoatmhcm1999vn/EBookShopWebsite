import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import "./index.css"
import App from "./App"
import { BrowserRouter as Router } from "react-router-dom"
import { CookiesProvider, Cookies } from "react-cookie"
import store from "./store"

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <React.StrictMode>
          <Router>
            <App cookie={Cookies} />
          </Router>
        </React.StrictMode>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
