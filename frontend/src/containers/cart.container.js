import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Cart from "../components/cart/cart"
import * as productActions from "../actions/product.action"
import * as homeActions from "../actions/home.action"
import * as userActions from "../actions/user.action"
import * as cartActions from "../actions/cart.action"

class CartContainer extends Component {
  constructor() {
    super()
  }
  componentWillMount() {
    this.props.actions.loadUser()
    this.props.cartActions.getCart()
    // console.log(this.props.city)
    this.props.cartActions.getCity()
  }
  render() {
    return (
      <Cart
        islogin={this.props.islogin}
        sortType={this.props.sortType}
        logout={() => this.props.actions.logout()}
        setSortType={value => this.props.homeActions.setSortType(value)}
        searchTextSubmit={() => this.props.homeActions.searchTextSubmit()}
        setSearchText={value => this.props.homeActions.setSearchText(value)}
        history={this.props.history}
        cart={this.props.cart}
        updateProductInCart={product =>
          this.props.cartActions.updateProductInCart(product)
        }
        deteleProductInCart={id_product =>
          this.props.cartActions.deteleProductInCart(id_product)
        }
        city={this.props.city}
        getDistrict={code => this.props.cartActions.getDistrict(code)}
        district={this.props.district}
        getWard={(codecity, codedistrict) =>
          this.props.cartActions.getWard(codecity, codedistrict)
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
          this.props.cartActions.payment(
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
    )
  }
}
const mapStateToProps = state => ({
  islogin: state.userReducers.user.islogin,
  cart: state.cart.data,
  cartPayment: state.cart.paymentMethod,
  city: state.cart.city,
  district: state.cart.district,
  ward: state.cart.ward,
  ispay: state.cart.ispay
})

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(userActions, dispatch),
    homeActions: bindActionCreators(homeActions, dispatch),
    productActions: bindActionCreators(productActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CartContainer)
