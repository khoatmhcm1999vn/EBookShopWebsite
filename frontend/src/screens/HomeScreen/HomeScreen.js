import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/user.action";
import HomePageTheme from "../../components/HomePageTheme/HomePageTheme";
import CarouselImageSlider from "../../components/CarouselImageSlider/CarouselImageSlider";
// import SliderBrands from "../../components/SliderBrands/SliderBrands";
import SliderCards from "../../components/ProductCardsSlider/ProductCardsSlider";
// import ScrollButton from "../../components/ScrollButton/ScrollButton";
import SliderListProductRankTop5 from "../../components/SliderListProductRankTop5/SliderListProductRankTop5";

import HeaderTop from "../../components/header/header.top";
import HeaderMiddle from "../../components/header/header.middle";
import HeaderBottom from "../../components/header/header.bottom";
import FooterTop from "../../components/footer/footer.top";
import FooterMiddle from "../../components/footer/footer.middle";
import FooterBottom from "../../components/footer/footer.bottom";
import SliderListProductSoldTop10ByDay from "../../components/SliderListProductSoldTop10ByDay/SliderListProductSoldTop10ByDay";
import SliderListProductTop10ByCategory from "../../components/SliderListProductTop10ByCategory/SliderListProductTop10ByCategory";
import SliderListProductSoldTop10ByWeek from "../../components/SliderListProductSoldTop10ByWeek/SliderListProductSoldTop10ByWeek";

const HomeScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const islogin = useSelector((state) => state.userReducers.user.islogin);
  const dispatch = useDispatch();
  // console.log(cart.data)

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
          isActivatedHome={true}
          history={history}
        />
      </header>
      {/* <ScrollButton /> */}
      <CarouselImageSlider />
      {/* <SliderBrands /> */}
      <HomePageTheme />
      <SliderCards />
      <SliderListProductSoldTop10ByDay />
      <SliderListProductTop10ByCategory />
      <SliderListProductSoldTop10ByWeek />
      <SliderListProductRankTop5 />
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  );
};

export default HomeScreen;
