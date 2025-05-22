"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Link from "next/link";

// 页面标题映射
const pageTitles = {
  '/': '',
  '/upload': '看图写话小助手',
  '/books': '绘本墙',
  '/analysis/hunlian': '婚恋格局',
  '/analysis/yuanfen': '姻缘分析', 
  '/analysis/yunqi': '孕子预期',
  '/profile': '会员中心',
  '/analysis/result': '分析结果'
  // 添加更多页面路径和标题...
};

const Header = () => {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const pathName = usePathname() || '/';
  const isRootPage = pathName === '/';
  const currentTitle = pageTitles[pathName as keyof typeof pageTitles] || '';

  // mobile-sidebar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      <header
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 md:p-6 shadow-lg"
      >
        <Navbar
          fluid
          className={`rounded-none bg-transparent py-2  sm:px-30 px-2`}
        >
          <div className="flex gap-3 items-center justify-between w-full ">
            {
            isRootPage? (
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <Icon icon="lucide:book-open" width="30" height="30" className="mr-2"></Icon>
              AI绘本 + 看图写话
            </h1>
            ) : (
              <button className="text-lg font-bold rounded-lg text-white flex items-center hover:bg-blue-400 pr-3 py-2" onClick={
                ()=>{
                  router.back();
                }
              }>
              <Icon icon="lucide:chevron-left" width="30" height="30" className="mr-2"></Icon>
              返回
            </button>
            )
            }

            {!isRootPage && (
              <div className="flex gap-4 items-center justify-center"> 
              <h1 className="text-xl font-semibold text-white truncate max-w-xs">
              {currentTitle}
              </h1>
            </div>
            )}

            <div className="flex gap-4 items-center justify-end">
              
              {
                isRootPage && (
                <Link href={"/upload"} className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full font-medium transition-colors duration-200 shadow flex items-center">
                  <Icon icon="lucide:notebook-pen" width={24} height={24}></Icon>
                    帮我写
                </Link>
                )
              }

              <button id="bookshelf-btn" className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full font-medium transition-colors duration-200 shadow flex items-center">
                <Icon icon="lucide:book-copy" width={24} height={24}></Icon>
                我的绘本墙
              </button>
            </div>

          </div>
          
          
            
        </Navbar>
      </header>

      {/* Mobile Sidebar */}
      {/* <Drawer open={isOpen} onClose={handleClose} className="w-130">
        <Drawer.Items>
          <MobileSidebar handleClose={()=>handleClose()}/>
        </Drawer.Items>
      </Drawer> */}
    </>
  );
};

export default Header;
