import React, { useState, useEffect } from "react"
// import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getListFlashSalesProductTop10 } from "../../actions/home.action"
import Rating from "../../components/rating/Rating"

export default function SliderListFlashSalesProductTop10() {
  const dispatch = useDispatch()
  const products = useSelector(
    state => state.homeReducers.book.dataFlashSalesProductTop10
  )
  //   const productCategoryList = useSelector(
  //     (state) => state.homeReducers.book.dataProductCategoryIds
  //   );
  // const [id_category, setIdCategory] = useState("");

  const [totalProducts, setTotalProducts] = useState(10)

  useEffect(() => {
    dispatch(getListFlashSalesProductTop10())
  }, [dispatch])

  // console.log(products);

  function tinh(count) {
    return (count / totalProducts) * 100 + "%"
  }

  return (
    <div
      id="flashsale-slider"
      className="row"
      style={{ margin: "20px 0px 0px", padding: "0px", display: "block" }}
    >
      <div className="flashsale-header">
        <Link>
          <img
            src="https://cdn0.fahasa.com/media/wysiwyg/icon-menu/ico_flashsale@3x.png"
            alt=""
            style={{ width: "25px", height: "25px", marginLeft: "10px" }}
          />
          <span className="flashsale-header-title">FLASH SALE</span>
        </Link>
        <span>
          <div className="split"></div>
        </span>
        <span className="flashsale-page-countdown-label">Kết Thúc Trong</span>
        <div className="flashsale-page-countdown">
          <div className="flashsale-countdown">
            <span className="flashsale-countdown-number">00</span>
            <span>:</span>
            <span className="flashsale-countdown-number">57</span>
            <span>:</span>
            <span className="flashsale-countdown-number">33</span>
          </div>
        </div>
      </div>

      <div className="col-lg-12 col-md-12 col-sm-12 fhs-full-p">
        <div className="flashsale-body">
          <div className="bx-wrapper" style={{ maxWidth: "1845px" }}>
            <div
              className="bx-viewport"
              aria-live="polite"
              style={{
                width: "100%",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <ul
                className="flashsale-list"
                style={{
                  width: "10215%",
                  position: "relative",
                  transitionDuration: "0s",
                  transform: "translate3d(-19.4965px, 0px, 0px)"
                }}
              >
                {products && products ? (
                  <>
                    {products.map((p, i) => (
                      <li
                        className="item flashsale-item item-inner"
                        aria-hidden="false"
                        style={{
                          float: "left",
                          listStyle: "none",
                          position: "relative",
                          width: "270px"
                        }}
                      >
                        <div className="" style={{ position: "relative" }}>
                          <div className="new-label-pro-sale">
                            <span className="new-p-sale-label discount-l-fs">
                              {p.sale_percentage * 100}%
                            </span>
                          </div>
                          <div className="ma-box-content">
                            <div
                              className="products clearfix"
                              style={{ height: "203px" }}
                            >
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
                            <div className="flashsale-price">
                              <div className="flashsale-price-special">
                                {p.sellPrice}đ
                              </div>
                              <div className="flashsale-price-old">
                                {p.price}đ
                              </div>
                              <div className="episode-label">{p.episode}</div>
                            </div>
                            <div className="progress">
                              <span className="progress-value">
                                Đã Bán {p.sales}
                              </span>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: tinh(p.sales) }}
                                aria-valuenow="0"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
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
            </div>
            <div className="bx-controls bx-has-controls-direction bx-has-pager">
              <div className="bx-controls-direction">
                <a href="" className="bx-prev disabled">
                  Prev
                </a>
                <a href="" className="bx-next">
                  Next
                </a>
              </div>
              <div className="bx-pager bx-default-pager"></div>
            </div>
          </div>
          <div className="tabs-xem-them xem-them-item-aaa">
            <Link to={`/shop-page`}>Xem Thêm</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
