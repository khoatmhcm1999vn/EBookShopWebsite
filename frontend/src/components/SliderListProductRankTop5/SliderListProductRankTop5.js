import React, { useState, useEffect } from "react";
// import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListProductRankTop5 } from "../../actions/home.action";

export default function SliderListProductRankTop5() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.homeReducers.book.dataTop5Rank);
  const productCategoryList = useSelector(
    (state) => state.homeReducers.book.dataProductCategoryIds
  );
  const [id_category, setIdCategory] = useState("");
  const [currProduct, setCurrProduct] = useState(null);
  // const productsId = [
  //   "607ec7bc05b8f56dc8aa3613",
  //   "607ec7bc05b8f56dc8aa3650",
  //   "607ec99c05b8f56dc8aa3678",
  //   "6082aacb88f2fb6a04061c3f",
  //   "6083ad17f6bc7a254419a1c9",
  // ];

  useEffect(() => {
    dispatch(getListProductRankTop5(id_category));

    return function cleanup() {
      setCurrProduct(null);
    };
  }, [dispatch, id_category]);

  // console.log(products);

  return (
    <div className="block-vote">
      <div
        className="header-vote"
        style={{
          backgroundImage:
            "url(https://cdn0.fahasa.com/media/wysiwyg/Thang-6-2020/banner_vote_06_2020.png)",
        }}
      >
        <div className="title-vote">BẢNG XẾP HẠNG BOOK SHOP MIA</div>
      </div>
      <div className="tab-content">
        <div className="block-fhs-vote">
          <div className="swiper-container swiper-container-horizontal swiper-container-free-mode">
            <div
              className="top-voted-header swiper-wrapper"
              style={{
                marginTop: "8px",
                transform: "translate3d(0px, 0px, 0px",
              }}
            >
              <button
                id="cat-9"
                className="cat-item swiper-slide active swiper-slide-active"
                onClick={() => setIdCategory("")}
              >
                All
              </button>
              {productCategoryList && productCategoryList ? (
                <>
                  {productCategoryList.map((p, i) => (
                    <button
                      key={i}
                      id="cat-5981"
                      className="cat-item swiper-slide swiper-slide-next"
                      onClick={() => setIdCategory(p._id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </>
              ) : (
                <h3>No data</h3>
              )}
            </div>
          </div>
          <div id="top-voted-content" className="col-xs-12 col-md-5">
            {products && products ? (
              <>
                {products.map((p, i) => (
                  <div className="product-item2-container" key={i}>
                    <Link
                      id="id-281470"
                      className="product-item2"
                      to={`/product/${p._id}`}
                      onMouseEnter={() => setCurrProduct(p)}
                    >
                      <div className="index-number-container">
                        <div>{i + 1}</div>
                      </div>
                      <img src={p.img} alt={p.name} className="small-image2" />
                      <div className="vote-info">
                        <div className="name">{p.name}</div>
                        <div className="author">{p.author_name}</div>
                        <div className="vote-message">
                          {p.view_counts}&nbsp;điểm
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <h3>No data</h3>
            )}
          </div>
          <div
            id="top-voted"
            className="col-lg-7 col-sm-7 col-md-7 hidden-xs no-padding"
          >
            <div id="preview-product">
              <div className="col-lg-4 col-sm-4 col-md-4 col-xs-12 image-container no-padding">
                {currProduct && currProduct ? (
                  <Link
                    to={`/product/${currProduct._id}`}
                    className="product-link"
                  >
                    <img src={currProduct.img} className="image" alt="" />
                  </Link>
                ) : null}
                {/* <Link
                  to={`/product/${currProduct._id}`}
                  className="product-link"
                >
                  <img src={currProduct.img} className="image" alt="" />
                </Link> */}
              </div>
              <div className="col-lg-8 col-sm-8 col-md-8 col-xs-12">
                {currProduct && currProduct ? (
                  <>
                    <Link
                      to={`/product/${currProduct._id}`}
                      className="product-link"
                    >
                      <div className="col-xs-12 name"></div>
                      <div className="col-xs-12 author sub-info">
                        Tác giả: {currProduct.author_name}
                      </div>
                      <div className="col-xs-12 publisher sub-info">
                        Nhà xuất bản: {currProduct.publisher_name}
                      </div>
                    </Link>
                    <div
                      className="col-md-12 col-lg-12 col-sm-6 col-xs-12"
                      style={{ padding: "0px", marginTop: "16px" }}
                    >
                      <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6">
                        <div
                          className="final-price"
                          style={{ fontSize: "2em" }}
                        >
                          {currProduct.price} đ
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 description">
                      <p style={{ textAlign: "justify" }}>
                        <strong>{currProduct.name}</strong>
                      </p>
                      <p style={{ textAlign: "justify" }}>
                        <strong>{currProduct.describe}</strong>
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          {id_category && id_category != "" ? (
            <div className="tabs-xem-them xem-them-item-aaa">
              <Link to={`/ranking-page/id_category/${id_category}`}>
                Xem Thêm
              </Link>
            </div>
          ) : (
            <div className="tabs-xem-them xem-them-item-aaa">
              <Link to={`/ranking-page/id_category/all`}>Xem Thêm</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
