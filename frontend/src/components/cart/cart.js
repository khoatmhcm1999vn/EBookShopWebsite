import React, { Component } from "react"
import HeaderTop from "../header/header.top"
import HeaderMiddle from "../header/header.middle"
import FooterTop from "../footer/footer.top"
import FooterMiddle from "../footer/footer.middle"
import FooterBottom from "../footer/footer.bottom"
import ContentCart from "./content.cart"
import HeaderBottom from "../header/header.bottom"

class Cart extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div>
        <header id="header">
          <HeaderTop />
          <HeaderMiddle
            islogin={this.props.islogin}
            logout={() => this.props.logout()}
            history={this.props.history}
            cart={this.props.cart}
          />
          <HeaderBottom
            isDisabled={true}
            history={this.props.history}
            // isActivatedContactPage={true}
          />
        </header>
        <ContentCart
          islogin={this.props.islogin}
          cart={this.props.cart}
          updateProductInCart={product =>
            this.props.updateProductInCart(product)
          }
          deteleProductInCart={id_product =>
            this.props.deteleProductInCart(id_product)
          }
          city={this.props.city}
          getDistrict={code => this.props.getDistrict(code)}
          district={this.props.district}
          getWard={(codecity, codedistrict) =>
            this.props.getWard(codecity, codedistrict)
          }
          ward={this.props.ward}
          payment={(
            city,
            district,
            ward,
            address,
            phone,
            name,
            cart,
            email,
            paymentResult
          ) =>
            this.props.payment(
              city,
              district,
              ward,
              address,
              phone,
              name,
              cart,
              email,
              paymentResult
            )
          }
          ispay={this.props.ispay}
          cartPayment={this.props.cartPayment}
        />
        <footer id="footer">
          <FooterTop />
          <FooterMiddle />
          <FooterBottom />
        </footer>
      </div>
    )
  }
}
export default Cart
