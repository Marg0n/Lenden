import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// export
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
})

const useAxiosSecure = () => {

  
  const navigate = useNavigate()

  useEffect(() => {

    // request authorization interceptor to add authorization headers for every secure request to the API
    axiosSecure.interceptors.request.use(
      async req => {
        const token = await localStorage?.getItem('token')
        req.headers.authorization = `Bearer ${token}`
        return req
      },
      error => {
        // Do something here with the error
        return Promise.reject(error)
      }
    )

    // Intercepts 401 & 403 status to the API
    axiosSecure.interceptors.response.use(
      res => {
        return res
      },
      async error => {
        // console.log('error tracked in the interceptor', error.response)
        if (error.response.status === 401 || error.response.status === 403) {
          // await loggedOut()
          navigate('/login')
        }
        return Promise.reject(error)
      }
    )
  }, 
  // [loggedOut, navigate]
)

  return axiosSecure
}

export default useAxiosSecure
