export const debounce = (callback, waitFor) => {
  let timeout = 0
  return (...args) => {
    let result
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      result = callback(...args)
    }, waitFor)
    return result
  }
}
