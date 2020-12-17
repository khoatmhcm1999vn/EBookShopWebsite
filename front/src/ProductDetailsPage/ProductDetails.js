import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetailsById } from "../actions";
import Layout from "../Layout/Layout";
import { IoIosArrowForward, IoIosStar, IoMdCart } from "react-icons/io";
import { BiRupee } from "react-icons/bi";
import { AiFillThunderbolt } from "react-icons/ai";
// import { MaterialButton } from "../../components/MaterialUI";
import "./ProductDetails.css";
// import { generatePublicUrl } from "../urlConfig";
import { addToCart } from "../actions";

import { Link } from "react-router-dom";

import Image from "../FormElements/Image";

import Card from "../core/Card";

import { read, listRelated } from "../core/apiCore";

import { isAuthenticated } from "../auth";

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);

  const [productx1, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { token } = isAuthenticated();

  const loadSingleProduct = (productId) => {
    // Fetch single Product
    read(productId).then((data) => {
      if (!data) {
        setError("fail");
        setLoading(true);
      } else {
        setError("");
        setProduct(data);
        setLoading(false);
        // console.log(data.product._id)
        // Fetch related products if fetch single product successfully
        listRelated(data.product._id).then((data) => {
          if (!data) {
            setError("fail");
            setLoading(true);
          } else {
            setRelatedProduct(data);
            setLoading(false);
          }
        });
      }
    });
  };

  useEffect(() => {
    const { productId } = props.match.params;
    console.log(props);
    const payload = {
      params: {
        productId,
      },
    };
    dispatch(getProductDetailsById(payload));
    loadSingleProduct(productId);
  }, [props]);

  if (Object.keys(product.productDetails).length === 0) {
    return null;
  }

  const showNoRelated = () => {
    return relatedProduct.length === 0 && <h4>No related products found.</h4>;
  };

  const showButtonCart = () => {
    return isAuthenticated() ? (
      <div className="flexRow">
        <button
          title="ADD TO CART"
          bgColor="#ff9f00"
          textColor="#ffffff"
          style={{
            marginRight: "5px",
          }}
          // icon={<IoMdCart />}
          className="btn btn-outline-warning mt-2 mb-2 card-btn-1"
          onClick={() => {
            const { _id, name, price } = product.productDetails;
            const imageUrl = product.productDetails.imageUrl;
            dispatch(
              addToCart(isAuthenticated().user._id, isAuthenticated().token, {
                _id,
                name,
                price,
                imageUrl,
              })
            );
            // props.history.push(`/cart`);
          }}
        >
          Add to cart
        </button>
        {/* <button
                title="BUY NOW"
                bgColor="#fb641b"
                textColor="#ffffff"
                style={{
                  marginLeft: "5px",
                }}
                icon={<AiFillThunderbolt />}
              /> */}
      </div>
    ) : (
      <Link to="/login">
        <button className="btn btn-primary">Sign in to buy book!</button>
      </Link>
    );
  };

  const showError = () => error && <h2>Fail to load!</h2>;

  const showLoading = () =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  const catchError = (error) => {
    setError({ error: error });
  };

  return (
    <Layout
      title={product.productDetails && product.productDetails.name}
      description={
        product.productDetails &&
        product.productDetails.description &&
        product.productDetails.description.substring(0, 100)
      }
      className="container-fluid"
    >
      {/* <div>{product.productDetails.name}</div> */}

      <div className="productDescriptionContainer">
        <div className="flexRow">
          <div className="verticalImageStack">
            {/* {product.productDetails.productPictures.map((thumb, index) => (
              <div className="thumbnail">
                <img src={generatePublicUrl(thumb.img)} alt={thumb.img} />
              </div>
            ))} */}
            {/* <div className="thumbnail active">
              {
                product.productDetails.productPictures.map((thumb, index) => 
                <img src={generatePublicUrl(thumb.img)} alt={thumb.img} />)
              }
            </div> */}
          </div>
          <div className="productDescContainer">
            <div className="productDescImgContainer">
              <Image
                item={product.productDetails}
                imageUrl={product.productDetails.imageUrl}
              />
            </div>
            <Link to="/shop" className="btn btn-outline-warning float-left">
              Back
            </Link>
            {showButtonCart()}
          </div>
        </div>
        <div>
          {/* home > category > subCategory > productName */}
          <div className="breed">
            <ul>
              <li>
                <a href="#">Home</a>
                <IoIosArrowForward />
              </li>
              <li>
                <a href="#">Books</a>
                <IoIosArrowForward />
              </li>
              {/* <li>
                <a href="#">{product.productDetails.name}</a>
                <IoIosArrowForward />
              </li> */}
              {product.productDetails.category.map((c, i) => {
                return (
                  <li>
                    <a href="#"> {c.name}</a>
                    <IoIosArrowForward />
                  </li>
                );
              })}
              <li>
                <a href="#">{product.productDetails.name}</a>
              </li>
            </ul>
          </div>
          {/* product description */}
          <div className="productDetails">
            <h2>Quantity {product.productDetails.quantity}</h2>
            <h2>Sold {product.productDetails.sold}</h2>
            <p className="productTitle">{product.productDetails.name}</p>
            <div>
              <span className="ratingCount">
                4.3 <IoIosStar />
              </span>
              <span className="ratingNumbersReviews">
                72,234 Ratings & 8,140 Reviews
              </span>
            </div>
            <div className="extraOffer">
              Extra <BiRupee />
              4500 off{" "}
            </div>
            <div className="flexRow priceContainer">
              <span className="price">
                <BiRupee />
                {product.productDetails.price}
              </span>
              <span className="discount" style={{ margin: "0 10px" }}>
                22% off
              </span>
              {/* <span>i</span> */}
            </div>
            <div>
              <p
                style={{
                  color: "#212121",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Available Offers
              </p>
              <p style={{ display: "flex" }}>
                <span
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    color: "#878787",
                    fontWeight: "600",
                    marginRight: "20px",
                  }}
                >
                  Description
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#212121",
                  }}
                >
                  {product.productDetails.description}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        {showError()}
        <h1 className="title p-3">Related Products</h1>
        {showNoRelated()}
        {showLoading()}
        <div className="row m-2">
          {relatedProduct.map((product) => (
            <div className="col-4" key={product._id}>
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
