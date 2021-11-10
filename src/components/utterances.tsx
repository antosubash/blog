import { useUtterances } from "../hooks/useUtterances";
interface Props {}
const commentNodeId = "comments";
export const Utterances = (props: Props) => {
  useUtterances(commentNodeId);
  return <div id={commentNodeId} />;
};
