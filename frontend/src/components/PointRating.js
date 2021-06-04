import React, { useEffect, useState } from "react"
import AxiosClient from "../config/axiosClient"
import { Button } from "react-bootstrap"
import { useSelector } from "react-redux"

export default function PointRating({ id_book, id_user, view_counts }) {
  const currentUser = useSelector(state => state.userReducers.user.currentUser)

  const bookId = id_book
  const userId = id_user

  const [FavoriteNumber, setFavoriteNumber] = useState(0)
  const [Favorited, setFavorited] = useState(false)
  const variables = {
    id_book: bookId,
    id_user: userId
  }

  const onClickPointRating = () => {
    if (!currentUser.user) {
      return alert("Please Log in first")
    }
    if (Favorited) {
      // when we are already subscribed
      AxiosClient.post("/point/remove/book", variables).then(response => {
        if (response.success) {
          setFavoriteNumber(FavoriteNumber - 1)
          setFavorited(!Favorited)
        } else {
          alert("Failed to Remove From Point")
        }
      })
    } else {
      // when we are not subscribed yet
      AxiosClient.post("/point/add/book", variables).then(response => {
        if (response.success) {
          setFavoriteNumber(FavoriteNumber + 1)
          setFavorited(!Favorited)
        } else {
          alert("Failed to Add Point")
        }
      })
    }
  }

  useEffect(() => {
    AxiosClient.post("/point/pointNumber", variables).then(response => {
      if (response.success) {
        setFavoriteNumber(response.subscribeNumber)
      } else {
        alert("Failed to get Point Number")
      }
    })
    AxiosClient.post("/point/pointed", variables).then(response => {
      if (response.success) {
        setFavorited(response.subcribed)
      } else {
        alert("Failed to get Point Information")
      }
    })
  }, [variables.id_book])

  // console.log(Favorited)

  return (
    <>
      <Button onClick={onClickPointRating}>
        {!Favorited ? "Add Point" : "Not Add Point"} by you {FavoriteNumber} by
        other {view_counts}
      </Button>
    </>
  )
}
