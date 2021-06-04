import ratesData from "./rates.json"

export default function tryConvert(money, code, encode = true) {
  const input = parseFloat(money)
  if (Number.isNaN(input)) {
    return ""
  }
  const currency = ratesData.rates[0].value.find(item => item.code === code)
  if (!currency) {
    return ""
  }
  const sell = parseFloat(currency.sell.replace(",", ""))
  const output = encode ? input * sell : input / sell
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString()
}
