import AxiosClient from "../config/axiosClient"

export const getBraintreeClientToken = () => {
  const responseData = AxiosClient.get(`/api/braintree/getToken`)
  return responseData
}
export const processPayment = paymentData => {
  const responseData = AxiosClient.post(`/api/braintree/payment`, paymentData)
  return responseData
}

export const getFilteredProducts = async ({
  limit = "",
  toSkip = "",
  published = "",
  name = "",
  id_category = "",
  order = "",
  min = 0,
  max = 0,
  stars = 0
}) => {
  const responseData = await AxiosClient.post(
    `/api/get-product-by-category-all-pagination?limit=${limit}&skip=${toSkip}&published=${published}&name=${name}&id_category=${id_category}&min=${min}&max=${max}&stars=${stars}&order=${order}`
    // ,
    // {
    //   skip: values.toSkip,
    //   limit: values.limit,
    // }
  )
  // console.log(responseData);
  return responseData.data
}

export const getUserBoard = () => {
  return AxiosClient.get("/dashboard?grant_type=refresh_token")
}
