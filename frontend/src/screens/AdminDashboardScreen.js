import React, { useState, useEffect } from "react"

import { getUserBoard } from "../utils/api"

export default function AdminDashboardScreen() {
  const [content, setContent] = useState("")

  useEffect(() => {
    getUserBoard().then(
      response => {
        setContent(response.message)
      },
      error => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()

        // console.log(error.response);
        setContent(_content)
      }
    )
  }, [])
  // console.log(content);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  )
}
