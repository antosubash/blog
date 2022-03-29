import Container from './container'

const Footer = () => {
  return (
    <footer className="border-accent-2">
      <Container>
        <div className="py-20 flex flex-col lg:flex-row items-center justify-center">
          <h3 className="text-xl font-bold text-center">
            &copy; Anto Subash
          </h3>
        </div>
      </Container>
    </footer>
  );
}

export default Footer
