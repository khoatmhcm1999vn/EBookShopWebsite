import React, { useEffect, useState } from "react"
import AxiosClient from "../config/axiosClient"
import { Button } from "react-bootstrap"
import { useSelector } from "react-redux"

function Favorite({ id_book, id_user, bookTitle, image }) {
  const currentUser = useSelector(state => state.userReducers.user.currentUser)
  const bookId = id_book
  const userId = id_user
  const name = bookTitle
  const imageUrl = image

  const [FavoriteNumber, setFavoriteNumber] = useState(0)
  const [Favorited, setFavorited] = useState(false)
  const variables = {
    id_book: bookId,
    id_user: userId,
    bookTitle: name,
    image: imageUrl
  }

  const onClickFavorite = () => {
    if (!currentUser.user) {
      return alert("Please Log in first")
    }
    if (Favorited) {
      // when we are already subscribed
      AxiosClient.post("/api/favourite/removeFromFavorite", variables).then(
        response => {
          if (response.success) {
            setFavoriteNumber(FavoriteNumber - 1)
            setFavorited(!Favorited)
          } else {
            alert("Failed to Remove From Favorite")
          }
        }
      )
    } else {
      // when we are not subscribed yet
      AxiosClient.post("/api/favourite/addToFavorite", variables).then(
        response => {
          if (response.success) {
            setFavoriteNumber(FavoriteNumber + 1)
            setFavorited(!Favorited)
          } else {
            alert("Failed to Add To Favorite")
          }
        }
      )
    }
  }

  useEffect(() => {
    AxiosClient.post("/api/favourite/favoriteNumber", variables).then(
      response => {
        if (response.success) {
          setFavoriteNumber(response.subscribeNumber)
        } else {
          alert("Failed to get Favorite Number")
        }
      }
    )
    AxiosClient.post("/api/favourite/favorited", variables).then(response => {
      if (response.success) {
        setFavorited(response.subcribed)
      } else {
        alert("Failed to get Favorite Information")
      }
    })
  }, [variables.id_book])

  return (
    <>
      <Button onClick={onClickFavorite}>
        {!Favorited ? "Add to Favorite" : "Not Favorite"} {FavoriteNumber}
      </Button>
    </>
  )
}

export default Favorite
