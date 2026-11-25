import { thunderIDProxy } from '@thunderid/nextjs/server'

// Keeps the session fresh on every request.
export default thunderIDProxy()

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
