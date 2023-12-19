import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {frontHostName} from "./config.js";

const app = express()

app.use(cors({ origin: [
    'http://localhost:3000', // If accessed directly
    'https://' + frontHostName // If accessed through caddy
  ], credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/cookies', (req, res) => {
  res.send(req.cookies)
})

app.post('/cookies', (req, res) => {
  try {
    const { name, value, expires, ...options } = req.body

    res
      .status(202)
      .cookie(name, value, {
        ...options,
        expires: new Date(expires),
      })
      .send('cookie created')
  } catch (e) {
    res.status(400).send(e.message)
  }
})

function getDeleteOptions({ name, value, expires, partitioned, ...options }) {
  return {
    partitioned: partitioned === 'true' ? partitioned : undefined,
    ...options
  }
}

app.delete('/cookies/last', (req, res) => {
  const cookies = req.cookies

  const cookieNames = Object.keys(cookies)
  const lastCookieName = cookieNames[cookieNames.length - 1]

  res.status(202).clearCookie(lastCookieName, getDeleteOptions(req.query)).send('cookie deleted')
})

app.delete('/cookies', (req, res) => {
  const { cookies } = req

  const cookieNames = Object.keys(cookies)
  console.log(cookieNames)
  cookieNames.forEach(cookieName => res.clearCookie(cookieName, getDeleteOptions(req.query)))

  res.send('all cookies deleted')
})

// Accessed via https://www.top-level.playground
app.get('/*', (req, res) => res.send(
    "<html>" +
    "<iframe src='https://" + frontHostName + "'  style=\"position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%;\"></iframe>" +
    "</html>"
))

app.listen(3333, () => {
  console.log('Server started on port 3333')
})
