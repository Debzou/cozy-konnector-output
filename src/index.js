// Library
const {
  cozyClient,
  log,
  BaseKonnector,
} = require('cozy-konnector-libs')
// Base url (API)
const BASE_URL  = 'http://localhost:8080'
// Http request
const axios = require('axios');
// doctype
const doctype = 'io.cozy.yourdoctype'
// it is better to put the admin password in a venv
const adminAPIlogin = 'admin55kkklll'
const adminAPIpassword = 'adminAAAaakkkk'

// MAIN
async function start() {
  try {
      // Gather documents in doctype file
      const documents = await cozyClient.data.findAll(doctype)
      // get jwt before post
      const jwt = await authAPI(adminAPIlogin,adminAPIpassword)
      const response = await welcomeAPI(jwt)
      log('info',response)
      consumptionPOSTAPI(jwt,documents)
  }catch (error) {
    throw new Error(error.message)
  }
  
}

// Authenticate API
// Return JWT
async function authAPI(login,password){
  // fetch data from a url endpoint
  const response = await axios.post(`${BASE_URL}/login`, {
    username: login,
    password: password,
  });
  log('info',response)
  const data = await response.data
  return data
}

// check if you are authenticate
// With JWT admin
async function welcomeAPI(jwt) {
  log('info',  jwt) 
  //fetch data from a url endpoint
  const response = await axios.get( 
    `${BASE_URL}/auth/hello`,{
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt.token}`
      }   
    }
  )
  const data = await response.data
  return data
}

function consumptionPOSTAPI(jwt,documents) {
  log('info',documents)
  documents.forEach(element => {
      //fetch data from a url endpoint
    log('info',element)
    axios.post( 
      `${BASE_URL}/auth/consumption`,element,{
        headers: {
        'accept': 'application/json, text/plain, */*',
        "Content-Type": 'application/json;charset=utf-8',
        "Authorization": `Bearer ${jwt.token}`
        }})
      .then(data => console.log(data))
  });     
}



// Konnector
module.exports = new BaseKonnector(start)
