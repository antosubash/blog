import Container from "@components/container";
import Layout from "@components/layout";
import { getAllTags } from "@lib/api";

type Props = {
  tags: string[];
};

const Index = ({ tags }: Props) => {
  return (
    <Layout>
      <Container>{tags.map((tag) => tag)}</Container>
    </Layout>
  );
};

export default Index;

export const getStaticProps = () => {
  var tags = getAllTags();
  return {
    props: { tags },
  };
};
