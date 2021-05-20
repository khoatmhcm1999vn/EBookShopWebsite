import React from "react";
// import HeaderTop from '../header/header.top'
// import HeaderMiddle from '../header/header.middle'
// import HeaderBottom from '../header/header.bottom'
// import FooterTop from '../footer/footer.top'
// import FooterMiddle from '../footer/footer.middle'
// import FooterBottom from '../footer/footer.bottom'
import ContentLoginRegister from "./content.login.register";

const LoginRegister = ({
  setEmailogin,
  setPasswordlogin,
  setEmail,
  setFirstname,
  setLastname,
  setAddress,
  setPhone,
  setPassword,
  setConfirm,
  notificationRegister,
  notificationLogin,
  registerSubmit,
  loginSubmit,
  islogin,
  currentUser,
  setCapchaValue,
  history,
  cart,
}) => (
  <ContentLoginRegister
    setEmailogin={(value) => setEmailogin(value)}
    setPasswordlogin={(value) => setPasswordlogin(value)}
    setEmail={(value) => setEmail(value)}
    setFirstname={(value) => setFirstname(value)}
    setLastname={(value) => setLastname(value)}
    setAddress={(value) => setAddress(value)}
    setPhone={(value) => setPhone(value)}
    setPassword={(value) => setPassword(value)}
    setConfirm={(value) => setConfirm(value)}
    notificationRegister={notificationRegister}
    notificationLogin={notificationLogin}
    registerSubmit={() => registerSubmit()}
    loginSubmit={() => loginSubmit()}
    islogin={islogin}
    currentUser={currentUser}
    setCapchaValue={(value) => setCapchaValue(value)}
    history={history}
    cart={cart}
  />
);

export default LoginRegister;

{
  /* <div>
            <header id="header">
                <HeaderTop />
                <HeaderMiddle
                    islogin={islogin}
                    logout={() => logout}
                    history={history}
                    />
                <HeaderBottom
                    sortType={sortType}
                    setSortType={(value) => setSortType(value)}
                    setSearchText={(value) => setSearchText(value)}
                    searchTextSubmit={() => searchTextSubmit()}
                />
            </header>
            
            <footer id="footer">
                <FooterTop />
                <FooterMiddle />
                <FooterBottom />
            </footer>
        </div> */
}
