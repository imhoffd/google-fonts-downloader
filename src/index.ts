import getIP from './getIP'

getIP().then(ip => {
  console.log(ip.data)
})
