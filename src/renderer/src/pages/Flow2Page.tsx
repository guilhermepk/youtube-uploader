import BackButton from "@renderer/components/BackButton";
import { FileUpload } from "@renderer/components/FileUpload";
import Page from "@renderer/components/Page";
import { StepItem, Stepper } from "@renderer/components/Stepper";
import { ReactNode, useState } from "react";

function Step({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-center justify-center p-4 h-[400px]">
      {children}
    </div>
  );
}

function Step1() {
  return (
    <Step>
      <FileUpload onFileChange={() => { }} />
    </Step>
  );
}

export default function Flow2Page(): React.JSX.Element {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const STEPS: Array<StepItem> = [
    { title: "Upload da planilha", content: <Step1 /> },
    { title: "Mapear Colunas", content: <Step><p>colunas</p></Step> },
    { title: "Processar vídeos", content: <Step><p>videos</p></Step> },
  ];

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) setCurrentStepIndex((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <Page className="p-0!">
      <LocalNavbar />

      <div className="w-[80%] bottom-[10px]">
        <Stepper
          steps={STEPS}
          currentStepIndex={currentStepIndex}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        />
      </div>
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