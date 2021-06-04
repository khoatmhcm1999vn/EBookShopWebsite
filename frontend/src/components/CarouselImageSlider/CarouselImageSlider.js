import React, { useEffect } from "react"
import Carousel from "react-bootstrap/Carousel"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getListProductFavorTop2 } from "../../actions/home.action"

// const sliderItems = [
//   {
//     id: "6082aacb88f2fb6a04061c3f",
//     name: "Photo 1",
//     url: "https://res.cloudinary.com/dhjbnicrr/image/upload/v1619176140/hlld1xb1gdgatshrojqe.jpg",
//   },
//   {
//     id: "6083ad17f6bc7a254419a1c9",
//     name: "Photo 2",
//     url: "https://res.cloudinary.com/dhjbnicrr/image/upload/v1619257461/nenjajn5gaiusvubqdcz.jpg",
//   },
// ];

const CarouselImageSlider = () => {
  const dispatch = useDispatch()
  const products = useSelector(
    state => state.homeReducers.book.dataProductFavorTop2
  )
  // const productCategoryList = useSelector(
  //   (state) => state.homeReducers.book.dataProductCategoryIds
  // );
  // const [id_category, setIdCategory] = useState("");
  // const [currProduct, setCurrProduct] = useState(null);
  // const productsId = [
  //   "607ec7bc05b8f56dc8aa3613",
  //   "607ec7bc05b8f56dc8aa3650",
  //   "607ec99c05b8f56dc8aa3678",
  //   "6082aacb88f2fb6a04061c3f",
  //   "6083ad17f6bc7a254419a1c9",
  // ];

  useEffect(() => {
    dispatch(getListProductFavorTop2())

    // return function cleanup() {
    //   setCurrProduct(null);
    // };
  }, [dispatch])

  const settings = {
    indicators: false,
    fade: true,
    infinite: true,
    interval: 3000
  }

  return (
    <div>
      <Carousel {...settings}>
        {products.map((item, index) => {
          return (
            <Carousel.Item key={item._id}>
              <Link to={`/product/${item._id}`}>
                <img className="carousel__img" src={item.img} alt={item.name} />
              </Link>
            </Carousel.Item>
          )
        })}
      </Carousel>
    </div>
  )
}

export default CarouselImageSlider
