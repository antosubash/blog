import SectionContainer from "./section-container";
import ThemeSwitch from "./theme-switch";
import PostTitle from "./post-title";
const LayoutWrapper = ({ children }: any) => {
  return (
    <SectionContainer>
      <div className="flex flex-col justify-between h-screen">
        <header className="flex items-center justify-between py-10">
          <div>
            <a href="/" aria-label="Blog">
              <div className="flex items-center justify-between">
                <div className="mr-3"></div>
              </div>
              <PostTitle>Anto Subash.</PostTitle>
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
