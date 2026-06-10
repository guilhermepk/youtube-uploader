import Page from "@renderer/components/Page";
import FullFlowCard from "./components/FullFlowCard";

export default function HomePage(): React.JSX.Element {
  return (
    <Page>
      <h1> Bem-vindo ao Workspace </h1>

      <FullFlowCard />
    </Page>
  );
}