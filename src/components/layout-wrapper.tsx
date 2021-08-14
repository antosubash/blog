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
              <p className="text-lg leading-7 px-5 text-center text-gray-500 dark:text-gray-400">
                A personal blog from a lazy programmer.
              </p>
            </a>
          </div>
          <div className="flex items-center text-base leading-5">
            <ThemeSwitch />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
