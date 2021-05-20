import React, { useEffect } from "react";
// import Carousel from "react-bootstrap/Carousel";
// import MessageBox from "../../components/message/Message";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/user.action";
import { getListProductByCategory } from "../../actions/home.action";

import HeaderTop from "../../components/header/header.top";
import HeaderMiddle from "../../components/header/header.middle";
import HeaderBottom from "../../components/header/header.bottom";
import FooterTop from "../../components/footer/footer.top";
import FooterMiddle from "../../components/footer/footer.middle";
import FooterBottom from "../../components/footer/footer.bottom";
// import Product from "../../components/Product/Product";
import { prices, ratings, times } from "../../utils/utils";
import RatingNormal from "../../components/RatingNormal";
import Rating from "../../components/rating/Rating";

export default function ShopScreen(props) {
  const {
    name = "all",
    id_category = "all",
    min = 0,
    max = 0,
    stars = 0,
    order = "newest",
    pageNumber = 1,
    pageSize = 10,
    sales = "all",
    updatedAtByDay = "all",
  } = useParams();

  const cart = useSelector((state) => state.cart);
  const islogin = useSelector((state) => state.userReducers.user.islogin);
  const products = useSelector(
    (state) => state.homeReducers.book.dataByCategory
  );
  const productsBe = useSelector((state) => state.homeReducers.book);
  const productCategoryList = useSelector(
    (state) => state.homeReducers.book.dataProductCategoryIds
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListProductByCategory({
        pageNumber,
        pageSize,
        name: name !== "all" ? name : "",
        id_category: id_category !== "all" ? id_category : "",
        min,
        max,
        stars,
        order,
        sales: sales !== "all" ? sales : "",
        updatedAtByDay: updatedAtByDay !== "all" ? updatedAtByDay : "",
      })
    );
  }, [
    dispatch,
    pageNumber,
    pageSize,
    name,
    id_category,
    min,
    max,
    stars,
    order,
    sales,
    updatedAtByDay,
  ]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterPageSize = filter.pageSize || pageSize;
    const filterCategory = filter.id_category || id_category;
    const filterName = filter.name || name;
    const filterRating = filter.stars || stars;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    let filterSales = filter.sales || sales;
    let filterUpdatedAtByDay = filter.updatedAtByDay || updatedAtByDay;
    if (
      sortOrder == "lowsale" ||
      sortOrder == "highsale" ||
      sortOrder == "highupdated"
    )
      filterSales = "1";
    else filterSales = "all";
    if (filterUpdatedAtByDay !== "all") filterSales = "1";
    console.log(filterSales);
    // console.log(filterRating);
    // console.log(filterPageSize);
    // console.log(filterMax);
    return `/shop-page/id_category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/stars/${filterRating}/sales/${filterSales}/updatedAtByDay/${filterUpdatedAtByDay}/order/${sortOrder}/pageNumber/${filterPage}/pageSize/${filterPageSize}`;
  };

  const clearFilter = () => {
    const filterPage = 1;
    const filterPageSize = 10;
    const filterCategory = "all";
    const filterName = "all";
    const filterRating = 0;
    const sortOrder = "newest";
    const filterMin = 0;
    const filterMax = 0;
    const filterSales = "all";
    const filterUpdatedAtByDay = "all";
    console.log(sortOrder);
    // console.log(filterMin);
    // console.log(filterMax);
    return props.history.push(
      `/shop-page/id_category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/stars/${filterRating}/sales/${filterSales}/updatedAtByDay/${filterUpdatedAtByDay}/order/${sortOrder}/pageNumber/${filterPage}/pageSize/${filterPageSize}`
    );
  };

  const clearFilterRating = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterPageSize = filter.pageSize || pageSize;
    const filterCategory = filter.id_category || id_category;
    const filterName = filter.name || name;
    const filterRating = 0;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    const filterSales = "all";
    const filterUpdatedAtByDay = "all";

    return `/shop-page/id_category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/stars/${filterRating}/sales/${filterSales}/updatedAtByDay/${filterUpdatedAtByDay}/order/${sortOrder}/pageNumber/${filterPage}/pageSize/${filterPageSize}`;
  };

  // console.log(productCategoryList);
  // console.log(productsBe);
  // console.log(order);

  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={props.history}
          cart={cart.data}
        />
        <HeaderBottom
          isDisabled={true}
          isActivatedHome={true}
          history={props.history}
        />
      </header>
      <div className="main-container col2-left-layout no-margin-top">
        <div className="main">
          <div>
            <div
              className="container"
              style={{ backgroundColor: "transparent!important" }}
            >
              <div className="mb-breadcrumbs">
                <div id="ves-breadcrumbs" className="breadcrumbs hidden-xs">
                  <div className="container-inner breadcrumbs">
                    <ol className="breadcrumb">
                      <li className="home">
                        <Link to="/" title="Tới trang chủ">
                          Trang chủ
                        </Link>
                        <span>/</span>
                      </li>
                      <li className="category6719">
                        <strong>Manga</strong>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="container-inner">
              <div className="d-flex justify-content-center">
                <div
                  className="col-left sidebar col-lg-3 col-md-3 col-sm-12 col-xs-12"
                  style={{ paddingLeft: "0px" }}
                >
                  <div className="mb-left">
                    <div className="mb-mana-catalog-leftnav">
                      <div className="mb-mana-catalog-leftnav">
                        <div className="block block-layered-nav">
                          <div className="block-content">
                            <div className="currently">
                              <div className="block-subtitle">
                                <div className="m-subtitle-actions">
                                  <div className="m-expand-collapse">
                                    <div className="btn-expand-collapse"></div>
                                  </div>
                                </div>
                                <span>Currently Shopping by:</span>
                              </div>
                            </div>
                            <div className="block-subtitle m-filter-group"></div>
                            <dl
                              id="narrow-by-list-0"
                              className="narrow-by-list"
                            >
                              <dt className="odd">Nhóm sản phẩm</dt>
                              <dd className="odd">
                                <ol
                                  id="parent-category"
                                  className="m-parent-category-list"
                                >
                                  <li>
                                    <Link to="/" title>
                                      Tất Cả Nhóm Sản Phẩm
                                    </Link>
                                  </li>
                                  <li style={{ marginLeft: "10px" }}>
                                    <Link to="/" title>
                                      Sách tiếng việt
                                    </Link>
                                  </li>
                                  <li style={{ marginLeft: "20px" }}>
                                    <Link to="/" title>
                                      Manga - Comic
                                    </Link>
                                  </li>
                                </ol>
                                <div
                                  id="current-category"
                                  className="m-current-category"
                                  style={{ marginLeft: "30px" }}
                                >
                                  <span className="m-selected-filter-item dfafsaf">
                                    Manga
                                  </span>
                                </div>
                                <ol
                                  id="children-categories"
                                  className="m-child-category-list"
                                  style={{ marginLeft: "30px", height: "58px" }}
                                >
                                  <li>
                                    <Link to="/" title>
                                      Manga Khác
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/" title>
                                      Series Manga
                                    </Link>
                                  </li>
                                </ol>
                                <div
                                  className="m-more-less"
                                  id="m-more-less-left_category"
                                  style={{ display: "none" }}
                                >
                                  <a
                                    style={{ display: "none" }}
                                    className="m-show-less-action"
                                  >
                                    Rút Gọn
                                  </a>
                                  <a
                                    style={{ display: "inline" }}
                                    className="m-show-more-action"
                                  >
                                    Xem Thêm
                                  </a>
                                </div>
                              </dd>
                              <dt className="even">Giá</dt>
                              <dd className="even">
                                <ol className="m-filter-css-checkboxes">
                                  {prices.map((p, i) => (
                                    <li key={i}>
                                      <Link
                                        to={getFilterUrl({
                                          min: p.min,
                                          max: p.max,
                                        })}
                                        className={
                                          `${p.min}-${p.max}` ===
                                          `${min}-${max}`
                                            ? "active"
                                            : ""
                                        }
                                        title={`${p.min}đ - ${p.max}đ`}
                                      >
                                        {p.name}
                                      </Link>
                                    </li>
                                  ))}
                                  {/* <li>
                                    <a
                                      id="price-m-0"
                                      className="m-checkbox-unchecked"
                                      title="0đ - 150,000đ"
                                    >
                                      0đ - 150,000đ
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      id="price-m-1"
                                      className="m-checkbox-unchecked"
                                      title="150,000đ - 300,000đ"
                                    >
                                      150,000đ - 300,000đ
                                    </a>
                                  </li> */}
                                </ol>
                              </dd>
                              <div id="menu-attributes">
                                <dt className="odd">Thể loại</dt>
                                <dd className="odd">
                                  <ol
                                    className="m-filter-css-checkboxes m-expandable-filter"
                                    style={{ height: "180px" }}
                                  >
                                    {productCategoryList &&
                                    productCategoryList ? (
                                      <>
                                        <li>
                                          <Link
                                            className={
                                              "all" === id_category
                                                ? "active"
                                                : ""
                                            }
                                            to={getFilterUrl({
                                              id_category: "all",
                                            })}
                                            title="Any"
                                          >
                                            Any
                                          </Link>
                                        </li>
                                        {productCategoryList.map((c, i) => (
                                          <li key={i}>
                                            <Link
                                              className={
                                                c._id === id_category
                                                  ? "active"
                                                  : ""
                                              }
                                              to={getFilterUrl({
                                                id_category: c._id,
                                              })}
                                              title={c.name}
                                            >
                                              {c.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </>
                                    ) : (
                                      <h3>No Data</h3>
                                    )}
                                    {/* <li>
                                      <a
                                        className="m-checkbox-unchecked"
                                        id="m-left-attr-genres1161215"
                                        title="Comedy"
                                      >
                                        Comedy
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="m-checkbox-unchecked"
                                        id="m-left-attr-genres1161240"
                                        title="Tragedy"
                                      >
                                        Tragedy
                                      </a>
                                    </li> */}
                                  </ol>
                                </dd>
                                <dt className="odd">Theo Thời Gian</dt>
                                <dd className="odd">
                                  <ol
                                    className="m-filter-css-checkboxes m-expandable-filter"
                                    style={{ height: "80px" }}
                                  >
                                    {times.map((c, i) => (
                                      <li key={i}>
                                        <Link
                                          className={
                                            c.value === updatedAtByDay
                                              ? "active"
                                              : ""
                                          }
                                          to={getFilterUrl({
                                            updatedAtByDay: c.value,
                                          })}
                                          title={c.value}
                                        >
                                          {c.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ol>
                                </dd>
                                <dt className="odd">Đánh giá trung bình</dt>
                                <dd className="odd">
                                  <ol
                                    className="m-filter-css-checkboxes"
                                    style={{ height: "100px" }}
                                  >
                                    {ratings.map((r, i) => (
                                      <li key={i}>
                                        <Link
                                          to={getFilterUrl({ stars: r.rating })}
                                          className={
                                            `${r.rating}` === `${stars}`
                                              ? "active"
                                              : ""
                                          }
                                          title={r.name}
                                        >
                                          <RatingNormal
                                            caption={" & up"}
                                            rating={r.rating}
                                          />
                                        </Link>
                                      </li>
                                    ))}
                                    {/* <li>
                                      <a
                                        id="m-left-attr-languages449750"
                                        className="m-checkbox-unchecked"
                                        title="Tiếng Việt"
                                      >
                                        Tiếng Việt
                                      </a>
                                    </li> */}
                                  </ol>
                                </dd>
                                <dt className="odd">Reset đánh giá</dt>
                                <dd className="odd">
                                  <ol
                                    className="m-filter-css-checkboxes"
                                    style={{ height: "15px" }}
                                  >
                                    <li>
                                      <Link
                                        to={clearFilterRating({})}
                                        title="Clear"
                                      >
                                        Clear
                                      </Link>
                                    </li>
                                  </ol>
                                </dd>
                                {/* <dt className="odd">Ngôn Ngữ</dt>
                                <dd className="odd">
                                  <ol
                                    className="m-filter-css-checkboxes"
                                    style={{ height: "29px" }}
                                  >
                                    <li>
                                      <a
                                        id="m-left-attr-languages449750"
                                        className="m-checkbox-unchecked"
                                        title="Tiếng Việt"
                                      >
                                        Tiếng Việt
                                      </a>
                                    </li>
                                  </ol>
                                </dd> */}
                                <dt
                                  id="m_left_book_layout_filter"
                                  className="odd"
                                >
                                  Nhà Cung Cấp
                                </dt>
                                <dd className="odd">
                                  <ol
                                    className="m-filter-css-checkboxes m-expandable-filter"
                                    style={{ height: "80px" }}
                                  >
                                    <li>
                                      <a
                                        id="m-left-attr-supplier_list448556"
                                        className="m-checkbox-unchecked"
                                        title="Nhà Xuất Bản Kim Đồng"
                                      >
                                        Nhà Xuất Bản Kim Đồng
                                      </a>
                                    </li>
                                  </ol>
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-main col-lg-9 col-md-9 col-sm-12 col-xs-12 col-fhs-main-body">
                  <div className="mb-content">
                    <div className="mb-category-products">
                      <div className="page-title category-title">
                        <h1>Manga</h1>
                      </div>
                      <div className="category-products row">
                        <div className="toolbar-top">
                          <div className="toolbar col-sm-12 col-xs-12 col-md-12">
                            <div className="sorter col-sm-4 col-xs-6 col-md-4">
                              <div>{products.length} Results</div>
                              {(id_category !== "all" ||
                                stars != 0 ||
                                sales !== "all") && (
                                <button className="small" onClick={clearFilter}>
                                  Remove Filter
                                </button>
                              )}
                              <p className="view-mode"></p>
                              <div className="abc-xyz">
                                <div className="dropdownfhs-text hidden-xs">
                                  <p>Sắp xếp theo :</p>
                                </div>
                                <div className="sort-by dropdownfhs dropdownfhs-select">
                                  <div className="selectBox selectBox-order">
                                    <select
                                      value={order}
                                      onChange={(e) => {
                                        props.history.push(
                                          getFilterUrl({
                                            order: e.target.value,
                                          })
                                        );
                                      }}
                                    >
                                      <option value="newest">
                                        Newest Arrivals
                                      </option>
                                      <option value="lowcreated">
                                        Lowest Arrivals
                                      </option>
                                      <option value="highupdated">
                                        Bán Chạy Theo Tuần
                                      </option>
                                      <option value="lowsearchname">
                                        Name: A - Z
                                      </option>
                                      <option value="highsearchname">
                                        Name: Z - A
                                      </option>
                                      <option value="lowest">
                                        Price: Low to High
                                      </option>
                                      <option value="highest">
                                        Price: High to Low
                                      </option>
                                      <option value="lowsale">
                                        Sold: Low to High
                                      </option>
                                      <option value="highsale">
                                        Sold: High to Low
                                      </option>
                                      <option value="lowrated">
                                        Avg. Customer Reviews Low to High
                                      </option>
                                      <option value="toprated">
                                        Avg. Customer Reviews High to Low
                                      </option>
                                    </select>
                                    {/* <span className="selected selected-order">
                                      Bán Chạy Tuần
                                    </span>
                                    <span className="selectArrow selectArrow-order"></span>
                                    <div
                                      className="selectOptions selectOptions-order"
                                      style={{ display: "none" }}
                                    >
                                      <span className="selectOption selectOption-order">
                                        Bán Chạy Tuần
                                      </span>
                                      <span className="selectOption selectOption-order">
                                        Bán Chạy Tháng
                                      </span>
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="pager col-sm-8 col-xs-5 col-md-8 hidden-xs">
                              Page Size
                              <select
                                value={pageSize}
                                onChange={(e) => {
                                  props.history.push(
                                    getFilterUrl({
                                      pageSize: e.target.value,
                                    })
                                  );
                                }}
                              >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                              </select>
                              {/* <div className="hidden-sm hidden-xs">
                                <div className="limiter hidden1-xs">
                                  <div className="select-sort-by dropdownfhs">
                                    <div className="selectBox selectBox-limit">
                                      <span className="selected selected-limit">
                                        24 sản phẩm
                                      </span>
                                      <span className="selectArrow selectArrow-limit"></span>
                                      <div className="selectOptions selectOptions-limit">
                                        <span className="selectOption selectOption-limit">
                                          12 sản phẩm
                                        </span>
                                        <span className="selectOption selectOption-limit">
                                          24 sản phẩm
                                        </span>
                                        <span className="selectOption selectOption-limit">
                                          48 sản phẩm
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <ul
                          id="products_grid"
                          className="products-grid fhs-top"
                        >
                          {products && products ? (
                            <>
                              {products.map((p, i) => (
                                <li>
                                  <div className="item-inner">
                                    <div className="ma-box-content">
                                      <div className="products clearfix">
                                        <div className="product images-container">
                                          <Link
                                            to={`/product/${p._id}`}
                                            className="product-image"
                                            title={p.name}
                                          >
                                            <span className="product-image">
                                              <img
                                                src={p.img}
                                                alt={p.name}
                                                width="200"
                                                height="200"
                                              />
                                            </span>
                                          </Link>
                                        </div>
                                      </div>
                                      <h2 className="product-name-no-ellipsis p-name-list">
                                        <Link
                                          to={`/product/${p._id}`}
                                          title={p.name}
                                        >
                                          {p.name}
                                        </Link>
                                      </h2>
                                      <div className="price-label">
                                        <span id="product-price-358583">
                                          <span className="price">
                                            <p className="special-price">
                                              <span className="price">
                                                {p.price}&nbsp;đ
                                              </span>
                                            </p>
                                          </span>
                                        </span>
                                      </div>
                                      <div className="rating-container">
                                        <div className="ratings">
                                          <div className="rating-box">
                                            <Rating value={p.stars} />
                                          </div>
                                          <div className="amount">
                                            ({p.reviewCount})
                                          </div>
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
                        <div className="row center pagination">
                          {[...Array(productsBe.pagesCate).keys()].map((x) => (
                            <Link
                              className={
                                x + 1 === productsBe.pageCate ? "active" : ""
                              }
                              key={x + 1}
                              to={getFilterUrl({ page: x + 1 })}
                            >
                              {x + 1}
                            </Link>
                          ))}
                        </div>
                        {/* <div className="toolbar-bottom">
                          <div className="toolbar col-sm-12 col-xs-12 col-md-12">
                            <div className="pager col-sm-12 col-xs-12 col-md-12">
                              <div className="col-sm-12 col-xs-12 col-md-12">
                                <div id="pagination" className="pages">
                                  <ol>
                                    <li className="current">
                                      <a>1</a>
                                    </li>
                                  </ol>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  );
}
