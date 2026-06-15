import BackButton from "@renderer/components/BackButton";
import Page from "@renderer/components/Page";
import { StepItem, Stepper } from "@renderer/components/Stepper";
import { useState } from "react";
import * as XLSX from 'xlsx';
import SheetUploadStep from "./components/SheetUploadStep";
import UpdateVideoFlowStepTemplate from "./components/UpdateVideoFlowStepTemplate";
import ColumnMappingStep from "./components/ColumnMappingStep";
import { ColumnData, useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import DownloadStep from "./components/DownloadStep";


export default function UpdateVideosFlowPage(): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const extractHeadersFromFile = async (fileToRead: File) => {
    const data = await fileToRead.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];

    if (jsonData.length > 0) {
      const extractedHeaders: Array<ColumnData> = jsonData[0].map((header, index) => ({ header, index }));
      updateFlowData({ extractedHeaders });
    }
  };

  function isSheetUploadValid(): boolean {
    const { sheet, sheetPath } = flowData;

    if (!sheet) {
      window.alert('Envie um arquivo antes de prosseguir');
      return false;
    }

    if (!sheetPath) {
      window.alert('O caminho para o arquivo enviado não foi definido');
      return false;
    }

    extractHeadersFromFile(sheet);
    return true;
  }

  function isMappingValid(): boolean {
    const { firstNameColumn, lastNameColumn, sectorColumn, urlColumn } = flowData;

    if (!firstNameColumn || !lastNameColumn || !sectorColumn || !urlColumn) {
      const fields: Array<{ name: string, value: any }> = [
        { name: 'Nome', value: firstNameColumn },
        { name: 'Sobrenome', value: lastNameColumn },
        { name: 'Setor', value: sectorColumn },
        { name: 'URL', value: urlColumn },
      ];
      const missing = fields.filter(item => !item.value);

      window.alert(`Mapeie todas as colunas antes de prosseguir. Campos faltando:\n\n${missing.map((item, index) => `${index + 1} - "${item.name}"`).join(';\n')}`);
      return false;
    }
    return true;
  }

  function isDownloadCompleted(): boolean {
    const { downloadFolderPath, downloadsCompleted } = flowData;
    if (!downloadFolderPath) {
      window.alert('Selecione a pasta de destino de download dos vídeos');
      return false;
    }

    if (!downloadsCompleted) {
      window.alert('O download ainda não terminou');
      return false;
    }

    return true;
  }

  const steps: Array<StepItem & { canMoveToNextStep?: () => boolean }> = [
    {
      title: "Upload da planilha",
      content: <SheetUploadStep
        file={flowData.sheet ?? null}
        onFileChange={(newValue: File) => {
          updateFlowData({
            sheet: newValue,
            sheetPath: window.api.fileManager.getFilePath(newValue)
          });
        }}
      />,
      canMoveToNextStep: isSheetUploadValid
    },
    {
      title: "Mapear colunas",
      content: <ColumnMappingStep />,
      canMoveToNextStep: isMappingValid
    },
    {
      title: "Download automático",
      content: <DownloadStep />,
      canMoveToNextStep: isDownloadCompleted
    },
    {
      title: "Upload manual",
      content: <UpdateVideoFlowStepTemplate><p className="text-white">Faça o upload dos vídeos em uma playlist e informe aqui a playlist escolhida</p></UpdateVideoFlowStepTemplate>
    },
    {
      title: "Atualização automática",
      content: <UpdateVideoFlowStepTemplate><p className="text-white">As informações dos vídeos serão atualizadas</p></UpdateVideoFlowStepTemplate>
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