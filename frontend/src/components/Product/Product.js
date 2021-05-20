import React from "react";
import { Link } from "react-router-dom";
import RatingNormal from "../RatingNormal";

export default function Product(props) {
  const { product } = props;
  // console.log(product)

  return (
    <div key={product._id} className="card">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.img} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2>{product.name}</h2>
        </Link>
        {product.stars && product.stars ? (
          <div className="d-flex flex-wrap align-items-center mt-2">
            <RatingNormal
              rating={product.stars}
              // numReviews={product.reviewCount}
            />
            {product.reviewCount > 0 && (
              <span>
                based on {product.reviewCount}
                &nbsp;reviews.
              </span>
            )}
          </div>
        ) : (
          <h3>Chưa có star nào.</h3>
        )}
        <div className="row">
          <div className="price">${product.price}</div>
        </div>
      </div>
    </div>
  );
}
