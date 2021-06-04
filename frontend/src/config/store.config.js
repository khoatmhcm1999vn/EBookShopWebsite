exports.setToken = token => {
  localStorage.setItem("access_token", token)
}
exports.removeToken = () => {
  localStorage.removeItem("access_token")
}
exports.getToken = () => {
  return localStorage.getItem("access_token")
}
exports.setRefreshToken = token => {
  localStorage.setItem("refresh_token", token)
}
exports.removeRefreshToken = () => {
  localStorage.removeItem("refresh_token")
}
exports.getRefreshToken = () => {
  return localStorage.getItem("refresh_token")
}

exports.getExpiryDate = () => {
  return localStorage.getItem("expiryDate")
}

exports.setEmail = email => {
  localStorage.setItem("email", email)
}
exports.removeEmail = () => {
  localStorage.removeItem("email")
}
exports.getEmail = () => {
  return localStorage.getItem("email")
}

exports.isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false
  }
  if (localStorage.getItem("access_token")) {
    return true
  } else {
    return false
  }
}
exports.isAuthenticatedx1 = () => {
  if (typeof window === "undefined") {
    return false
  }
  if (localStorage.getItem("access_token")) {
    return JSON.parse(localStorage.getItem("access_token"))
  } else {
    return false
  }
}

exports.setUser = user => {
  localStorage.setItem("userInfo", JSON.stringify(user))
}
exports.getUser = () => {
  if (typeof window === "undefined") {
    return false
  }
  if (localStorage.getItem("userInfo") === null) return false
  return JSON.parse(localStorage.getItem("userInfo"))
}
exports.clear = () => {
  localStorage.clear()
}

exports.setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
exports.removeLocalStorage = key => {
  if (window !== "undefined") {
    localStorage.removeItem(key)
  }
}
exports.getLocalStorage = key => {
  if (window !== "undefined") {
    return JSON.parse(localStorage.getItem(key))
  }
  return null
}

exports.getCart = () => {
  if (localStorage.getItem("cart") === null) return null
  return JSON.parse(localStorage.getItem("cart"))
}
exports.removeCart = () => {
  localStorage.removeItem("cart")
}
exports.addProductToCart = product => {
  let cart
  if (localStorage.getItem("cart") !== null) {
    cart = JSON.parse(localStorage.getItem("cart"))
  } else {
    cart = []
  }
  let index = cart.findIndex(element => product._id === element._id)
  if (index === -1) {
    cart = [...cart, product]
  } else {
    cart[index].count = parseInt(cart[index].count) + parseInt(product.count)
  }
  localStorage.setItem("cart", JSON.stringify(cart))
}
exports.updateProductInCart = product => {
  let cart = this.getCart()
  if (cart === null) {
    return false
  }
  let index = cart.findIndex(element => product._id === element._id)
  if (index === -1) {
    return false
  } else {
    cart[index].count = product.count
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  return true
}
exports.deteleProductInCart = id_product => {
  let cart = this.getCart()
  if (cart === null) {
    return false
  }
  let index = cart.findIndex(element => id_product === element._id)
  if (index === -1) {
    return false
  } else {
    cart.splice(index, 1)
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  return true
}
