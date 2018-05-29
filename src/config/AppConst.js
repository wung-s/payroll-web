export const isProduction = process.env.NODE_ENV === "production"
export default {
  baseURL: isProduction ? process.env.REACT_APP_BASE_URL : "http://localhost:4000"
}
