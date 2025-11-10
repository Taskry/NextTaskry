"use client"// TODO use client 추가

import Link from "next/link";

export function Navigation(){ 
  return (
    <nav className="border-b mx-3">
      <div className="container flex h-14 max-w-screen-2xl justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <h2>홈</h2>
          </Link>
          <Link href="/sample/icon">
            <h2>Icon 샘플 페이지</h2>
          </Link>
          <Link href="/sample/color">
            <h2>Color 샘플 페이지</h2>
          </Link>
        </div>
        <div className="flex items-center gap-4">
        </div>
      </div>
    </nav>
  )
}