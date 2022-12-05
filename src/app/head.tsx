import Meta from "@components/meta";

export default function Head() {
  return (
    <>
      <title></title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
      <Meta
        title="Anto's blog"
        description="My personal blog"
        keywords="anto blog"
        image="/og/home.png"
      />
    </>
  );
}
