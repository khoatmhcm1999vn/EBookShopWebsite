import React, { useEffect, useState } from "react";
import AxiosClient from "../config/axiosClient";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/user.action";
import HeaderTop from "../components/header/header.top";
import HeaderMiddle from "../components/header/header.middle";
import FooterTop from "../components/footer/footer.top";
import FooterMiddle from "../components/footer/footer.middle";
import FooterBottom from "../components/footer/footer.bottom";

function FavoritePage({ history }) {
  const dispatch = useDispatch();
  const islogin = useSelector((state) => state.userReducers.user.islogin);
  const currentUser = useSelector(
    (state) => state.userReducers.user.currentUser
  );
  const [Favorites, setFavorites] = useState([]);
  const [Loading, setLoading] = useState(true);
  let variable = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    fetchFavoredMovie();
  }, []);
  const fetchFavoredMovie = () => {
    AxiosClient.post("/api/favourite/getFavoredBook", variable).then(
      (response) => {
        if (response.success) {
          setFavorites(response.favorites);
          setLoading(false);
        } else {
          alert("Failed to get subscription videos");
        }
      }
    );
  };
  const onClickDelete = (bookId, userId) => {
    const variables = {
      id_book: bookId,
      id_user: userId,
    };
    AxiosClient.post("/api/favourite/removeFromFavorite", variables).then(
      (response) => {
        if (response.success) {
          fetchFavoredMovie();
        } else {
          alert("Failed to Remove From Favorite");
        }
      }
    );
  };
  const renderCards = Favorites.map((favorite, index) => {
    return (
      <tr key={index}>
        <td>
          <Link to={`/product/${favorite.id_book}`}>{favorite.bookTitle}</Link>
        </td>
        <td className="cart_product">
          <Link to={`/product/${favorite.id_book}`}>
            <img src={favorite.image} alt="" />
          </Link>
        </td>
        <td>
          <button
            onClick={() => onClickDelete(favorite.id_book, favorite.id_user)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={history}
        />
      </header>
      <div class="breadcrumbs">
        <ol class="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="active">Favourite</li>
        </ol>
      </div>
      <h3> Favorite Books By Me </h3>
      <hr />
      {!currentUser.user ? (
        <div
          style={{
            width: "100%",
            fontSize: "2rem",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Please Log in first...</p>
          <a href="/login_register">Go to Login page</a>
        </div>
      ) : (
        !Loading && (
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Book Image</th>
                <td>Remove from favorites</td>
              </tr>
            </thead>
            <tbody>{renderCards}</tbody>
          </table>
        )
      )}
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  );
}

export default FavoritePage;
