import axios from 'axios'

const getIP = async () => {
  return axios.get('https://ip.dwieeb.com')
}

export default getIP
