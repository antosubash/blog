import SectionContainer from "./section-container";
import ThemeSwitch from "./theme-switch";
import PageTitle from "./page-title";
const LayoutWrapper = ({ children }: any) => {
  return (
    <SectionContainer>
      <div className="flex flex-col justify-between h-screen">
        <header className="flex items-center justify-between py-10">
          <div>
            <a href="/" aria-label="Blog">
              <PageTitle>Anto Subash.</PageTitle>
              <p className="hidden md:block text-lg leading-7 px-5 text-center text-gray-500 dark:text-gray-400">
                A personal blog from a lazy programmer.
              </p>
            </a>
          </div>

          <div className="flex items-center text-base leading-5">
            <div className="hidden md:block">
              <a href="/" className="font-bold px-5">
                Home
              </a>
              <a href="/tags" className="font-bold px-5">
                Tags
              </a>
              <a href="https://antosubash.com" className="font-bold px-5">
                About
              </a>
            </div>

            <ThemeSwitch />
            <div className="hidden">
              <button className="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-4">
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
        <main className="mb-auto">{children}</main>
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
