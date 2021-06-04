import React from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../actions/user.action"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import HeaderTop from "../../components/header/header.top"
import HeaderMiddle from "../../components/header/header.middle"
import FooterTop from "../../components/footer/footer.top"
import FooterMiddle from "../../components/footer/footer.middle"
import FooterBottom from "../../components/footer/footer.bottom"
import HeaderBottom from "../../components/header/header.bottom"

const ContactScreen = ({ history }) => {
  const cart = useSelector(state => state.cart)
  const islogin = useSelector(state => state.userReducers.user.islogin)
  const dispatch = useDispatch()

  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={history}
          cart={cart.data}
        />
        <HeaderBottom
          isDisabled={true}
          history={history}
          isActivatedContactPage={true}
        />
      </header>

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
                  <li className="active">
                    <strong>Contacts</strong>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div class="breadcrumbs">
        <ol class="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="active">Contacts</li>
        </ol>
      </div> */}
      <div className="container mt-5">
        <h4>
          <FontAwesomeIcon className="ml-2 mr-2" icon={faInfoCircle} />
          Contacts
        </h4>
        <br />
        <p>
          <b>Mobile:</b> (066) 696-66-23
          <br />
          <b>E-mail:</b> bookonlineshop@gmail.com
        </p>
        <br />
        <h6>Working time</h6>
        <p>The online book store is open from 07:00 to 22:00 until weekend.</p>
        <br />
        <h6>Delivery</h6>
        <p>Delivery of orders come through courier service.</p>
      </div>
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  )
}

export default ContactScreen
