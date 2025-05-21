// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // const token = request.cookies.get('auth-token')?.value || ''
  
  // const protectedPaths = ['/members','/analysis','/report','/profile']
  // const isProtectedPath = protectedPaths.some(path => 
  //   request.nextUrl.pathname.startsWith(path)
  // )

  // const skipAuth = request.nextUrl.searchParams.get("__skipAuth")

  // if (skipAuth) {
  //    return NextResponse.next()
  // }

  // const isHomePath = request.nextUrl.pathname === '/'
  // // 需要登录
  // if (token === '' && (isProtectedPath || isHomePath)) {
  //   // console.log('need login')
  //   // console.log(request.cookies)
  //   const loginUrl = new URL('/login', request.url)
  //   return NextResponse.redirect(loginUrl)
  // }
  // console.log('not need login' + token)
  return NextResponse.next()
}