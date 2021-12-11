import Container from "@components/container";
import Layout from "@components/layout";
import Tag from "@components/tag";
import { getAllTags } from "@lib/api";

type Props = {
  tags: string[];
};

const Index = ({ tags }: Props) => {
  return (
    <Layout>
      <Container>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Tag text={tag} />
          ))}
        </div>
      </Container>
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
