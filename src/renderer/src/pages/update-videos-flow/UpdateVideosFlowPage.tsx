import BackButton from "@renderer/components/BackButton";
import Page from "@renderer/components/Page";
import { StepItem, Stepper } from "@renderer/components/Stepper";
import { useState } from "react";
import * as XLSX from 'xlsx';

import SheetUploadStep from "./components/SheetUploadStep";
import Flow2StepTemplate from "./components/Flow2StepTemplate";
import ColumnMappingStep from "./components/ColumnMappingStep";

export default function UpdateVideosFlowPage(): React.JSX.Element {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Estados do Step 1
  const [file, setFile] = useState<File | null>(null);

  // Estados do Step 2
  const [headers, setHeaders] = useState<string[]>([]);
  const [titleColumn, setTitleColumn] = useState('');
  const [descriptionColumn, setDescriptionColumn] = useState('');

  // Lógica isolada para ler os cabeçalhos do Excel
  const extractHeadersFromFile = async (fileToRead: File) => {
    const data = await fileToRead.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];

    if (jsonData.length > 0) {
      setHeaders(jsonData[0]);
    }
  };

  function isSheetUploadValid(): boolean {
    if (!file) {
      window.alert('Envie um arquivo antes de prosseguir');
      return false;
    }

    extractHeadersFromFile(file);
    return true;
  }

  function isMappingValid(): boolean {
    if (!titleColumn || !descriptionColumn) {
      window.alert('Mapeie todas as colunas antes de prosseguir');
      return false;
    }
    return true;
  }

  const steps: Array<StepItem & { canMoveToNextStep?: () => boolean }> = [
    {
      title: "Upload da planilha",
      content: <SheetUploadStep file={file} onFileChange={setFile} />,
      canMoveToNextStep: isSheetUploadValid
    },
    {
      title: "Mapear Colunas",
      content: (
        <ColumnMappingStep
          headers={headers}
          titleColumn={titleColumn}
          descriptionColumn={descriptionColumn}
          onTitleColumnChange={setTitleColumn}
          onDescriptionColumnChange={setDescriptionColumn}
        />
      ),
      canMoveToNextStep: isMappingValid
    },
    {
      title: "Processar vídeos",
      content: <Flow2StepTemplate><p className="text-white">Processamento usando as colunas: {titleColumn} e {descriptionColumn}</p></Flow2StepTemplate>
    },
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
    <div className="bg-[#1b1b1f] shadow-md w-full h-[60px] flex items-center gap-7 py-2 px-4">
      <BackButton />
      <h1 className="text-[25px]! text-white"> Fluxo de atualização de vídeos </h1>
    </div>
  );
}