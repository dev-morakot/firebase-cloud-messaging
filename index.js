const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./messanging-5f0cf-firebase-adminsdk-xuytr-a1b54882e7.json')
const databaseURL = 'https://messanging-5f0cf.firebaseio.com'
const URL = 'https://fcm.googleapis.com/v1/projects/messanging-5f0cf/messages:send'
const deviceToken = 'dagiODvxNu0:APA91bEKBq-r9Q_90OGdah8pRJiGeXTPR1RhSIKJvUM0pRDPUC0NkOAcO0zlKQzuQGG4DQy5ijyH8OcHhUQ9aYMttXvsKc98W7Y6jTrU_lkehvrieE3vwZK_1W3Ys6ndB13u3UAll9jX'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()