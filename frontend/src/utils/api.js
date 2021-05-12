import AxiosClient from "../config/axiosClient";

export const getBraintreeClientToken = () => {
  const responseData = AxiosClient.get(`/api/braintree/getToken`);
  return responseData;
};
export const processPayment = (paymentData) => {
  const responseData = AxiosClient.post(`/api/braintree/payment`, paymentData);
  return responseData;
};
