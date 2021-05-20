import React, { useState, useEffect } from "react";
// import Carousel from "react-bootstrap/Carousel";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/user.action";
import { getListProductRankTopAll } from "../../actions/home.action";

import HeaderTop from "../../components/header/header.top";
import HeaderMiddle from "../../components/header/header.middle";
import HeaderBottom from "../../components/header/header.bottom";
import FooterTop from "../../components/footer/footer.top";
import FooterMiddle from "../../components/footer/footer.middle";
import FooterBottom from "../../components/footer/footer.bottom";
// import Rating from "../../components/rating/Rating";
// import { prices, ratings } from "../../utils/utils";

export default function RankingScreen(props) {
  const cart = useSelector((state) => state.cart);
  const islogin = useSelector((state) => state.userReducers.user.islogin);
  const products = useSelector(
    (state) => state.homeReducers.book.dataTopAllRank
  );
  const productCategoryList = useSelector(
    (state) => state.homeReducers.book.dataProductCategoryIds
  );
  const [id_category, setIdCategory] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListProductRankTopAll(id_category));
  }, [dispatch, id_category]);

  //   console.log(productCategoryList);
  //   console.log(id_category);

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
        <HeaderBottom isDisabled={true} isActivatedHome={true} />
      </header>
      <div className="margin-bottom: 5px;">
        <div
          className="container"
          style={{ backgroundColor: "transparent!important" }}
        >
          <div id="ves-breadcrumbs" className="breadcrumbs hidden-xs">
            <div className="container-inner breadcrumbs">
              <ol className="breadcrumb">
                <li className="home">
                  <Link to="/" title="Tới trang chủ">
                    Trang chủ
                  </Link>
                </li>
                <li className="cms_page">
                  <strong>MIA BOOK SHOP AWARD</strong>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="std">
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
            <div id="block-fhs-vote">
              <div className="swiper-container swiper-container-horizontal swiper-container-free-mode">
                <div
                  className="top-voted-header swiper-wrapper"
                  style={{ marginTop: "8px" }}
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
                  {/* <button
                    id="cat-9"
                    className="cat-item swiper-slide active swiper-slide-active"
                  >
                    Văn học
                  </button>
                  <button
                    id="cat-5981"
                    className="cat-item swiper-slide swiper-slide-next"
                  >
                    Light Novel
                  </button>
                  <button id="cat-14" className="cat-item swiper-slide">
                    Thiếu nhi
                  </button> */}
                </div>
              </div>
              <div id="top-voted-content" className="col-xs-12 col-md-12">
                {products && products ? (
                  <>
                    {products.map((p, i) => (
                      <div className="product-item2-container" key={i}>
                        <Link
                          id="id-281470"
                          className="product-item2"
                          to={`/product/${p._id}`}
                          //   target="_blank"
                          //   rel="noreferrer"
                        >
                          <div className="index-number-container">
                            <div>{i + 1}</div>
                            {/* <i
                              className="fa fa-arrow-up"
                              style={{ color: "green" }}
                            ></i> */}
                          </div>
                          <img
                            src={p.img}
                            alt={p.name}
                            className="small-image2"
                          />
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
