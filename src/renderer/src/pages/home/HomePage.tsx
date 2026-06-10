import Flow1Card from "./components/Flow1Card";

export default function HomePage(): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center p-10 gap-10 w-full"
    >
      <h1> Bem-vindo ao Workspace </h1>

      <Flow1Card />
    </div>
  );
}