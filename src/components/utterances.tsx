import { useUtterances } from "../hooks/useUtterances";
export const Utterances = ({ slug }: { slug: string }) => {
  const commentNodeId = "comments-" + slug;
  useUtterances(commentNodeId);
  return <div className="pt-8" id={commentNodeId} />;
};
