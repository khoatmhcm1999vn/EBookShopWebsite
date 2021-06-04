import React, { useEffect, useRef, useState } from "react"
import socketIOClient from "socket.io-client"
import { useSelector } from "react-redux"
import MessageBox from "../components/message/Message"
import NavbarContainer from "../containers/navbar.container"
import Slider from "../containers/slider.container"
import { Link } from "react-router-dom"

let allUsers = []
let allMessages = []
let allSelectedUser = {}
const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:8090"
    : window.location.host

export default function SupportScreen() {
  const [selectedUser, setSelectedUser] = useState({})
  const [socket, setSocket] = useState(null)
  const uiMessagesRef = useRef(null)
  const [messageBody, setMessageBody] = useState("")
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  // const userSignin = useSelector((state) => state.userSignin);
  // const { userInfo } = userSignin;
  const currentUser = useSelector(state => state.userReducers.user.currentUser)
  const { user } = currentUser
  console.log(user)

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth"
      })
    }

    if (!socket) {
      const sk = socketIOClient(ENDPOINT)
      setSocket(sk)
      sk.emit("onLogin", {
        _id: user._id,
        name: user.firstName,
        is_admin: user.is_admin
      })
      sk.on("message", data => {
        if (allSelectedUser._id === data._id) {
          allMessages = [...allMessages, data]
        } else {
          const existUser = allUsers.find(user => user._id === data._id)
          if (existUser) {
            allUsers = allUsers.map(user =>
              user._id === existUser._id ? { ...user, unread: true } : user
            )
            setUsers(allUsers)
          }
        }
        setMessages(allMessages)
      })
      sk.on("updateUser", updatedUser => {
        const existUser = allUsers.find(user => user._id === updatedUser._id)
        if (existUser) {
          allUsers = allUsers.map(user =>
            user._id === existUser._id ? updatedUser : user
          )
          setUsers(allUsers)
        } else {
          allUsers = [...allUsers, updatedUser]
          setUsers(allUsers)
        }
      })
      sk.on("listUsers", updatedUsers => {
        allUsers = updatedUsers
        setUsers(allUsers)
      })
      sk.on("selectUser", user => {
        allMessages = user.messages
        setMessages(allMessages)
      })
    }
  }, [messages, socket, users])

  const selectUser = user => {
    allSelectedUser = user
    setSelectedUser(allSelectedUser)
    const existUser = allUsers.find(x => x._id === user._id)
    if (existUser) {
      allUsers = allUsers.map(x =>
        x._id === existUser._id ? { ...x, unread: false } : x
      )
      setUsers(allUsers)
    }
    socket.emit("onUserSelected", user)
  }

  const submitHandler = e => {
    e.preventDefault()
    if (!messageBody.trim()) {
      alert("Error. Please type message.")
    } else {
      allMessages = [
        ...allMessages,
        { body: messageBody, name: user.firstName }
      ]
      setMessages(allMessages)
      setMessageBody("")
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: user.firstName,
          is_admin: user.is_admin,
          _id: selectedUser._id
        })
      }, 1000)
    }
  }

  return (
    <section id="container" className="">
      <NavbarContainer />
      <Slider activateSupport={true} />
      <section id="main-content">
        <section className="wrapper">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="page-header">
                <i className="fa fa-laptop" /> Support
              </h3>
              <ol className="breadcrumb">
                <li>
                  <i className="fa fa-home" />
                  <Link to="/dashboard">Home</Link>
                </li>
                <li>
                  <i className="fa fa-laptop" />
                  Support
                </li>
              </ol>
            </div>
          </div>
          <div className="col-1 support-users">
            {users.filter(x => x._id !== user._id).length === 0 && (
              <MessageBox>No Online User Found</MessageBox>
            )}
            <ul>
              {users
                .filter(x => x._id !== user._id)
                .map(user => (
                  <li
                    key={user._id}
                    className={
                      user._id === selectedUser._id ? "  selected" : "  "
                    }
                  >
                    <button
                      className="block"
                      type="button"
                      onClick={() => selectUser(user)}
                    >
                      {user.name}
                    </button>
                    <span
                      className={
                        user.unread
                          ? "unread"
                          : user.online
                          ? "online"
                          : "offline"
                      }
                    />
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-3 support-messages">
            {!selectedUser._id ? (
              <MessageBox>Select a user to start chat</MessageBox>
            ) : (
              <div>
                <div className="row">
                  <strong>Chat with {selectedUser.name} </strong>
                </div>
                <ul ref={uiMessagesRef}>
                  {messages.length === 0 && <li>No message.</li>}
                  {messages.map((msg, index) => (
                    <li key={index}>
                      <strong>{`${msg.name}: `}</strong> {msg.body}
                    </li>
                  ))}
                </ul>
                <div>
                  <form onSubmit={submitHandler} className="row">
                    <input
                      value={messageBody}
                      onChange={e => setMessageBody(e.target.value)}
                      type="text"
                      placeholder="type message"
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </section>
  )
}
