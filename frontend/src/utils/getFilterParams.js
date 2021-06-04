import { isEmpty } from "lodash"
import qs from "query-string"

export default function getFilterParams(search) {
  let params = {}
  try {
    params = qs.parse(search)
  } catch (error) {
    params = {}
  }
  return params
}
// VÍ DỤ:
// queryString.parse('foo[0]=1&foo[1]=2&foo[3]=3', {arrayFormat: 'index'});
// => {foo: ['1', '2', '3']}
