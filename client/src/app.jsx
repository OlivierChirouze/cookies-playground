import * as React from 'react'

import { CookieInput } from './components/cookie-input'
import { CookieGrid } from './components/cookie-grid'
import { Buttons } from './components/buttons'

import * as client from './utils/client.utils'
import * as server from './utils/server.utils'

// FIXME more elaborate extraction of TLD+1 (based on npm library)
export function getTLDPlusOne(hostName) {
  return hostName.split('.').slice(1).join('.')
}

export function App() {
  const path = window.location.pathname
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost'
  const domain = getTLDPlusOne(hostname)
  const backHostName = isLocalhost ? 'localhost' : 'back.' + domain
  const backBaseUrl = isLocalhost ? 'http://localhost:3333' : 'https://' + backHostName

  const [cookieInput, setCookieInput] = React.useState({
    name: 'a',
    value: 1,
    path,
    expires: 300,
    sameSite: 'Strict',
    secure: false,
    httpOnly: false,
    partitioned: false,
    domain: isLocalhost ? '' : domain,
  })

  /**
   * Triggering rerender.
   */
  const [rerender, setRerender] = React.useState(0)
  const refresh = () => setRerender(rerender + 1)

  /**
   * Client and server cookies
   */
  const clientCookies = client.getAllCookies()
  const [serverCookies, setServerCookies] = React.useState([])
  React.useEffect(() => {
    // /!\ Notice! We add the path to only read cookies from the sub-path if relevant
    server.getAllCookies(backBaseUrl + path).then(setServerCookies).catch(console.error)
  }, [rerender])

  /**
   * Convert `expires` value to a Date object
   */
  const expiresInSeconds = Number(cookieInput.expires) * 1000
  const expiresDate = new Date(Date.now() + expiresInSeconds)
  const cookie = {
    ...cookieInput,
    expires: expiresDate,
  }

  const { name, value, ...options } = cookieInput

  return (
    <>
      <header className="headings">
        <h1>🍪 Cookies Playground</h1>
        <p>
          Exploring and playing around with cookies on the client and the server
        </p>
      </header>
      <main>
        <CookieInput cookie={cookieInput} setCookie={setCookieInput} />

        <div>
          <Buttons
            title="Client"
            description="Set cookies on the client side"
            onCreate={() => client.createCookie(cookie)}
            onRemoveLast={client.removeLastCookie}
            onRemoveAll={client.removeAllCookies}
            onRefresh={refresh}
            onClick={refresh}
          />
          <CookieGrid
            title={"Client cookies on " + hostname + path}
            description="The cookies that we can access using JavaScript"
            cookies={clientCookies}
          />
        </div>

        <div>
          <Buttons
            title="Server"
            description="Set cookies on the server"
            onCreate={() => server.createCookie(backBaseUrl, cookie)}
            onRemoveLast={() => server.removeLastCookie(backBaseUrl, options)}
            onRemoveAll={() => server.removeAllCookies(backBaseUrl, options)}
            onRefresh={refresh}
            onClick={refresh}
          />
          <CookieGrid
            title={"Server cookies on " + backHostName + path}
            description="The cookies that we can access on the server"
            cookies={serverCookies}
          />
        </div>
      </main>
    </>
  )
}
