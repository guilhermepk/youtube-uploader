import BackButton from "@renderer/components/BackButton";
import Page from "@renderer/components/Page";

export default function Flow2Page(): React.JSX.Element {
  return (
    <Page className="p-0!">
      <LocalNavbar />
    </Page>
  );
}

function LocalNavbar(): React.JSX.Element {
  return (
    <div
      className={`
          bg-[#1b1b1f]
          shadow-md
          w-full h-[60px]
          flex items-center gap-7
          py-2 px-4
        `}
    >
      <BackButton />

      <h1 className="text-[25px]!"> Fluxo de upload 2 </h1>
    </div>
  );
}