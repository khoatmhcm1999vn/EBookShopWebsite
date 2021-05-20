import React, { useState, useEffect } from "react";
// import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListProductSoldTop10ByDay } from "../../actions/home.action";
import Rating from "../../components/rating/Rating";

export default function SliderListProductSoldTop10ByDay() {
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.homeReducers.book.dataProductSoldTop10ByDay
  );
  //   const productCategoryList = useSelector(
  //     (state) => state.homeReducers.book.dataProductCategoryIds
  //   );
  // const [id_category, setIdCategory] = useState("");

  const [totalProducts, setTotalProducts] = useState(10);
  const [sales, setSales] = useState("1");
  const [updatedAtByDay, setUpdatedAtByDay] = useState("day");

  useEffect(() => {
    dispatch(getListProductSoldTop10ByDay());
  }, [dispatch]);

  // console.log(products);

  function tinh(count) {
    return (count / totalProducts) * 100 + "%";
  }

  return (
    <div id="categorytab-gia-noi-bat" className="categorytab-slider fhs-grid">
      <div>
        <div className="tabslider-header">
          <div
            className="tabslider-title girdslider-title-aaa"
            style={{ backgroundColor: "#FCDDEF", paddingBottom: "12px" }}
          >
            <div className="header-icon-gridslider">
              <img
                src="https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png"
                alt=""
                className="center"
              />
            </div>
            <span>Xu Hướng Mua Sắm</span>
          </div>
          <div className="tab-title ma-title">
            <div className="tabslider-tabs tabslider-tabs-gird">
              <ul className="tabs tabs-gia-noi-bat  tab_categorys girdslider-header-menu-aaa">
                <div className="ts-header">
                  <li className="active girdslider-menu-item-aaa">
                    Xu Hướng Theo Ngày
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="tabslider-top-content"
          style={{ marginBottom: "10px" }}
        ></div>
        <div className="tab_container">
          <div className="col-lg-12 col-md-12 col-sm-12 fhs-full-p">
            <div
              id="tabdeal-gia-noi-bat"
              className="tab_content_gia-noi-bat"
              style={{ minHeight: "400px" }}
            >
              <ul className="bxslider">
                <li className="item items-sl-width">
                  {products && products ? (
                    <>
                      {products.map((p, i) => (
                        <div
                          className="item-inner"
                          style={{ position: "relative" }}
                        >
                          <div className="ma-box-content">
                            <div className="products clearfix">
                              <div className="product images-container">
                                <Link
                                  className="product-image"
                                  title={p.name}
                                  to={`/product/${p._id}`}
                                >
                                  <div className="product-image">
                                    <img src={p.img} alt={p.name} />
                                  </div>
                                </Link>
                              </div>
                            </div>
                            <h2 className="product-name-no-ellipsis">
                              <Link to={`/product/${p._id}`} title={p.name}>
                                {p.name}
                              </Link>
                            </h2>
                            <div className="price-label">
                              <p className="special-price">
                                <span className="price-label">
                                  Special Price
                                </span>
                                <span
                                  id="product-price-362055"
                                  className="price m-price-font"
                                >
                                  {p.price}đ
                                </span>
                              </p>
                            </div>
                            <div
                              className="fhs-rating-container"
                              style={{ height: "20px" }}
                            >
                              <div className="ratings fhs-no-mobile-block">
                                <Rating value={p.stars} />
                                <div className="amount">({p.reviewCount})</div>
                              </div>
                            </div>
                          </div>
                          <div className="progress position-bar-gridslider color-progress-grid">
                            <div
                              className="progress-bar color-bar-grid 362055-bar"
                              role="progressbar"
                              aria-valuenow="0"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ width: tinh(p.sales) }}
                            ></div>
                            <div className="text-progress-bar">
                              <span className="362055-bar">
                                Đã bán {p.sales}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <h3>No data</h3>
                  )}
                </li>
              </ul>
              <div className="tabs-xem-them xem-them-item-aaa">
                <Link
                  to={`/shop-page/sales/${sales}/updatedAtByDay/${updatedAtByDay}`}
                >
                  Xem Thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
