import SectionContainer from "./section-container";
import ThemeSwitch from "./theme-switch";
import PageTitle from "./page-title";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Kofi from "./kofi";
import Link from "next/link";
const LayoutWrapper = ({ children }: any) => {
  let [isShowing, setIsShowing] = useState(false);
  return (
    <SectionContainer>
      <div className="flex flex-col justify-between h-screen">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/" aria-label="Blog">
              <PageTitle>Anto Subash.</PageTitle>
              <p className="hidden md:block text-lg leading-7 px-5 text-center text-gray-500 dark:text-gray-400">
                A personal blog from a lazy programmer.
              </p>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5 pr-6">
            <div className="hidden md:block">
              <div className="flex">
                {/* <div className="flex justify-center items-center font-bold px-5 cursor-pointer">
                  <CommandBar>
                    <ShortcutHome />
                  </CommandBar>
                </div> */}
                <div className="flex justify-center items-center font-bold">
                  <Link href="/page" className="font-bold px-5">
                    Articles
                  </Link>
                </div>
                <div className="flex justify-center items-center font-bold">
                  <Link href="/series" className="font-bold px-5">
                    Series
                  </Link>
                </div>
                <div className="flex justify-center items-center font-bold">
                  <Link href="/tags" className="font-bold px-5">
                    Tags
                  </Link>
                </div>
                <div className="flex justify-center items-center font-bold umami--click--consulting-desktop">
                  <Link href="/consulting" className="font-bold px-5">
                    Consulting
                  </Link>
                </div>
                <div className="flex justify-center items-center font-bold umami--click--about-desktop">
                  <Link
                    href="https://antosubash.com"
                    className="font-bold px-5"
                  >
                    About
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/rss.xml">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </Link>

            <ThemeSwitch />
            <div className="md:hidden">
              <button
                onClick={() => setIsShowing(!isShowing)}
                className="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <div className="md:hidden">
          <Transition
            as={Fragment}
            show={isShowing}
            enter="transform transition duration-[900ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-[900ms] transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 scale-95 "
          >
            <ul className="border-b-2 border-t-2 border-gray-500">
              <li>
                <a
                  href="/"
                  className="block text-xl text-center px-2 py-4 hover:bg-gray-400 dark:hover:bg-gray-700 font-bold"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/page"
                  className="block text-xl text-center px-2 py-4 hover:bg-gray-400 dark:hover:bg-gray-700 font-bold"
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href="/tags"
                  className="block text-xl text-center px-2 py-4 hover:bg-gray-400 dark:hover:bg-gray-700 font-bold"
                >
                  Tags
                </a>
              </li>
              <li>
                <a
                  href="/consulting"
                  className="block text-xl text-center px-2 py-4 hover:bg-gray-400 dark:hover:bg-gray-700 font-bold umami--click--consulting-mobile"
                >
                  Consulting
                </a>
              </li>
              <li>
                <a
                  href="https://antosubash.com"
                  className="block text-xl text-center px-2 py-4 hover:bg-gray-400 dark:hover:bg-gray-700 font-bold umami--click--about-mobile"
                >
                  About
                </a>
              </li>
            </ul>
          </Transition>
        </div>
        <main className="mb-auto">{children}</main>
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
