import React from "react"
import Chatbox from "../ChatBox"
import { useSelector } from "react-redux"

const FooterTop = () => {
  const currentUser = useSelector(state => state.userReducers.user.currentUser)
  // const { user } = currentUser;
  // if (currentUser) console.log(currentUser);

  return (
    <div className="footer-top">
      <div className="container">
        <div className="row">
          <div className="col-sm-2">
            <div className="companyinfo">
              <h2>
                <span>e-book-</span>shopper
              </h2>
              <p>
                Đây là website bán sách trực tuyến được xây dựng bởi công nghệ
                MERN STACK.
              </p>
            </div>
          </div>
          <div className="col-sm-7">
            <div className="col-sm-3">
              <div className="video-gallery text-center">
                <a href="#">
                  <div className="iframe-img">
                    <img src="/img/home/iframe1.png" alt="" />
                  </div>
                  <div className="overlay-icon">
                    <i className="fa fa-play-circle-o"></i>
                  </div>
                </a>
                <p>Circle of Hands</p>
                <h2>24 DEC 2020</h2>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="video-gallery text-center">
                <a href="#">
                  <div className="iframe-img">
                    <img src="/img/home/iframe2.png" alt="" />
                  </div>
                  <div className="overlay-icon">
                    <i className="fa fa-play-circle-o"></i>
                  </div>
                </a>
                <p>Circle of Hands</p>
                <h2>24 DEC 2020</h2>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="video-gallery text-center">
                <a href="#">
                  <div className="iframe-img">
                    <img src="/img/home/iframe3.png" alt="" />
                  </div>
                  <div className="overlay-icon">
                    <i className="fa fa-play-circle-o"></i>
                  </div>
                </a>
                <p>Circle of Hands</p>
                <h2>24 DEC 2020</h2>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="video-gallery text-center">
                <a href="#">
                  <div className="iframe-img">
                    <img src="/img/home/iframe4.png" alt="" />
                  </div>
                  <div className="overlay-icon">
                    <i className="fa fa-play-circle-o"></i>
                  </div>
                </a>
                <p>Circle of Hands</p>
                <h2>24 DEC 2020</h2>
              </div>
            </div>
          </div>
          {currentUser && !currentUser.user.is_admin ? <Chatbox /> : null}
          {/* <Chatbox /> */}
          <div className="col-sm-3">
            <div className="address">
              <img src="/img/home/map.png" alt="" />
              <p>
                Đường Phan Xích Long, Quận Bình Thạnh, Thành phố Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterTop
