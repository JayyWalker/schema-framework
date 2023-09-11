import { createServer } from 'http'
import { AuthorEntity, router } from './schema'

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  const handleRequest = () => {
    const [routeMatcher, routeHandler] = router([AuthorEntity])

    const route = routeMatcher(req)

    const response = routeHandler(route, req, res)

    response.httpHeaders.forEach((value, key) => {
      res.setHeader(key, value)
    })
    res.statusCode = response.httpStatus
    res.end(response.httpBody)
  }

  if (req.url === '/favicon.ico') {
    res.end('')
  } else {
    console.log('handling request')
    handleRequest()
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
