import React, { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getListProductBestSellerTop10 } from "../../actions/home.action";
import "./ProductCardsSlider.css";
import StarRating from "../rating/Rating";

const ProductCardsSlider = () => {
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.homeReducers.book.dataProductBestSellerTop10
  );
  const productsId = products.map((p, i) => p._id);

  useEffect(() => {
    dispatch(getListProductBestSellerTop10());
  }, [dispatch]);

  //console.log(productsId);

  const addCarouselItems = (array, counter) => {
    return (
      <Carousel.Item>
        <div className="card-deck">
          {array.map((product) => {
            for (let i = counter; i < counter + 4; i++) {
              if (product._id === productsId[i]) {
                return (
                  <div className="card" key={product.id}>
                    <div
                      style={{
                        height: "130px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Link to={`/product/${product._id}`}>
                        <img
                          style={{ width: "125px" }}
                          src={`${product.img}`}
                          alt={product.name}
                        />
                      </Link>
                    </div>
                    <div className="card-body text-center">
                      <h5>{product.name}</h5>
                      {/* <h6>{product.perfumer}</h6> */}
                      <StarRating value={product.stars} />
                      <h6>
                        $<span>{product.price}</span>.00
                      </h6>
                      <Link to={`/product/${product._id}`}>
                        <span className="btn btn-dark">SHOW MORE</span>
                      </Link>
                    </div>
                  </div>
                );
              }
            }
          })}
        </div>
      </Carousel.Item>
    );
  };

  const settings = { controls: false };

  return (
    <div>
      <div className="container text-center my-3">
        <h3>PERSONALLY RECOMMENDED</h3>
      </div>
      <div className="container mt-5" id="indicators">
        <form method="get" action="/">
          <Carousel {...settings}>
            {addCarouselItems(products, 0)}
            {addCarouselItems(products, 4)}
            {addCarouselItems(products, 8)}
          </Carousel>
        </form>
      </div>
    </div>
  );
};

export default ProductCardsSlider;
