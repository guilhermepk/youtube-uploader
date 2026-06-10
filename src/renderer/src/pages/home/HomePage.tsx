import Page from "@renderer/components/Page";
import Flow2Card from "./components/Flow2Card";
// import FullFlowCard from "./components/FullFlowCard";

export default function HomePage(): React.JSX.Element {
  return (
    <Page>
      <h1> Bem-vindo ao Workspace </h1>

      {/* <FullFlowCard /> */}
      <Flow2Card />
    </Page>
  );
}