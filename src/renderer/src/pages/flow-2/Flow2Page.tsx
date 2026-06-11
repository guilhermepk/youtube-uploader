import BackButton from "@renderer/components/BackButton";
import Page from "@renderer/components/Page";
import { StepItem, Stepper } from "@renderer/components/Stepper";
import { useState } from "react";
import SheetUploadStep from "./components/SheetUploadStep";
import Flow2StepTemplate from "./components/Flow2StepTemplate";
export default function Flow2Page(): React.JSX.Element {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  function isSheetUploadValid(): boolean {
    if (!file) {
      window.alert('Envie um arquivo antes de prosseguir');
      return false;
    } else return true;
  }

  const steps: Array<StepItem & { canMoveToNextStep?: () => boolean }> = [
    { title: "Upload da planilha", content: <SheetUploadStep file={file} onFileChange={setFile} />, canMoveToNextStep: isSheetUploadValid },
    { title: "Mapear Colunas", content: <Flow2StepTemplate><p>colunas</p></Flow2StepTemplate> },
    { title: "Processar vídeos", content: <Flow2StepTemplate><p>videos</p></Flow2StepTemplate> },
  ];

  const nextStep = () => {
    const currentStep = steps[currentStepIndex];
    const currentStepAllows: boolean = currentStep.canMoveToNextStep ? currentStep.canMoveToNextStep() : true;

    if (currentStepIndex < (steps.length - 1) && currentStepAllows) setCurrentStepIndex((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <Page className="p-0!">
      <LocalNavbar />

      <div className="w-[80%] bottom-[10px]">
        <Stepper
          steps={steps}
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