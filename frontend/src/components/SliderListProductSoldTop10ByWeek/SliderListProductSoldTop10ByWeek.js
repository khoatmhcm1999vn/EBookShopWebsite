import React, { useState, useEffect } from "react";
// import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListProductSoldTop10ByWeek } from "../../actions/home.action";
import Rating from "../../components/rating/Rating";

export default function SliderListProductSoldTop10ByWeek() {
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.homeReducers.book.dataProductSoldTopAllByWeek
  );
  const productsPage = useSelector((state) => state.homeReducers.book);
  const productCategoryList = useSelector(
    (state) => state.homeReducers.book.dataProductCategoryIds
  );
  const [id_category, setIdCategory] = useState("");
  const [sales, setSales] = useState("1");
  const [updatedAtByDay, setUpdatedAtByDay] = useState("week");
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    dispatch(getListProductSoldTop10ByWeek(id_category, pageNumber));
  }, [dispatch, id_category, pageNumber]);

  // console.log(productsPage);

  return (
    <div id="categorytab-topsach" className="categorytab-slider fhs-grid">
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
            <span>Top Thể Loại Theo Tuần</span>
          </div>
          <div className="tab-title ma-title">
            <div className="tabslider-tabs tabslider-tabs-gird">
              <ul className="tabs tabs-topsach tab_categorys girdslider-header-menu-aaa">
                <div className="ts-header">
                  <li
                    className="girdslider-menu-item-aaa active"
                    onClick={() => setIdCategory("")}
                  >
                    All
                  </li>
                  {productCategoryList && productCategoryList ? (
                    <>
                      {productCategoryList.map((p, i) => (
                        <li
                          key={i}
                          className="girdslider-menu-item-aaa"
                          onClick={() => setIdCategory(p._id)}
                        >
                          {p.name}
                        </li>
                      ))}
                    </>
                  ) : (
                    <h3>No data</h3>
                  )}
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
              id="tabtopmanga-topsach"
              className="tab_content_topsach swiper-container swiper-container-horizontal"
            >
              <ul
                className="bxslider swiper-wrapper"
                style={{ transform: "translate3d(0px, 0px, 0px" }}
              >
                {products && products ? (
                  <>
                    {products.map((p, i) => (
                      <li
                        key={i}
                        className="item ul-items-sl-width swiper-slide swiper-slide-active"
                        style={{ width: "200px" }}
                      >
                        <div
                          className="item-inner"
                          style={{ position: "relative" }}
                        >
                          <div className="label-pro-sale m-label-pro-sale"></div>
                          <div className="ma-box-content">
                            <div className="products clearfix">
                              <div className="product images-container">
                                <Link
                                  to={`/product/${p._id}`}
                                  title={p.name}
                                  className="product-image"
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
                                <span className="price-label">Giá bán</span>
                                <span
                                  id="product-price-184842"
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
                        </div>
                      </li>
                    ))}
                  </>
                ) : (
                  <h3>No data</h3>
                )}
              </ul>
              {id_category && id_category != "" ? (
                <div className="tabs-xem-them xem-them-item-aaa">
                  <Link
                    // target="_blank"
                    // rel="noreferrer"
                    to={`/shop-page/id_category/${id_category}/sales/${sales}/updatedAtByDay/${updatedAtByDay}`}
                  >
                    Xem Thêm
                  </Link>
                </div>
              ) : (
                <div className="tabs-xem-them xem-them-item-aaa">
                  <Link
                    // target="_blank"
                    // rel="noreferrer"
                    to={`/shop-page/id_category/all/sales/${sales}/updatedAtByDay/all`}
                  >
                    Xem Thêm
                  </Link>
                </div>
              )}
            </div>
            <div className="topmanga-topsach-button-parent">
              {products.currPageProductSoldTopAllByWeek >=
              productsPage.totalPageProductSoldTopAllByWeek ? (
                <button
                  className="topmanga-topsach-prev fhs-tab-slider-prev position-tab-prev swiper-button-prev"
                  style={{ display: "block" }}
                  tabIndex="0"
                  // role="button"
                  aria-label="Previous slide"
                  aria-disabled="false"
                  // disabled
                  onClick={() => setPageNumber(pageNumber - 1)}
                ></button>
              ) : productsPage.totalPageProductSoldTopAllByWeek === 0 ||
                products.length ===
                  productsPage.pageSizeOnePageProductSoldTopAllByWeek ? (
                <button
                  className="topmanga-topsach-prev fhs-tab-slider-prev position-tab-prev swiper-button-prev"
                  style={{ display: "block" }}
                  tabIndex="0"
                  // role="button"
                  aria-label="Previous slide"
                  aria-disabled="false"
                  onClick={() => setPageNumber(1)}
                ></button>
              ) : (
                <button
                  className="topmanga-topsach-prev fhs-tab-slider-prev position-tab-prev swiper-button-prev"
                  style={{ display: "block" }}
                  tabIndex="0"
                  // role="button"
                  aria-label="Previous slide"
                  aria-disabled="false"
                  disabled
                  // onClick={() => setPageNumber(pageNumber - 1)}
                ></button>
              )}

              {productsPage.currPageProductSoldTopAllByWeek <
              productsPage.totalPageProductSoldTopAllByWeek ? (
                <button
                  className="topmanga-topsach-next fhs-tab-slider-next position-tab-next swiper-button-next"
                  style={{ display: "block" }}
                  tabIndex="0"
                  aria-label="Next slide"
                  aria-disabled="false"
                  onClick={() => setPageNumber(pageNumber + 1)}
                ></button>
              ) : (
                <button
                  className="topmanga-topsach-next fhs-tab-slider-next position-tab-next swiper-button-next"
                  style={{ display: "block" }}
                  tabIndex="0"
                  aria-label="Next slide"
                  aria-disabled="false"
                  disabled
                  // onClick={() => setPageNumber(pageNumber + 1)}
                ></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
