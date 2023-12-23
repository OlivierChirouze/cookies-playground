export function CookieGrid({
  title,
  description,
  cookies = [],
  isServer = false,
}) {
  return (
    <section>
      <hgroup>
        <h2>{title}</h2>
        <p>{description}</p>
      </hgroup>
      <table role="grid">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Value</th>
            {isServer && <th scope="col">Http Only</th>}
            {isServer && <th scope="col">SameSite</th>}
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie, i) => {
            let sliced = cookie.value.slice(0, 48);
            if (sliced !== cookie.value)
              sliced += '… (' + (cookie.value.length).toString() + ' chars total)'
            return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{cookie.name}</td>
                  <td>{sliced}</td>
                  {isServer && <td>{cookie.httpOnly}</td>}
                  {isServer && <td>{cookie.sameSite}</td>}
                </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
