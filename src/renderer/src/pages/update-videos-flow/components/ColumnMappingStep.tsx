import Select from "@renderer/components/Select";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";

interface ColumnMappingStepProps {
  headers: string[];
  titleColumn: string;
  descriptionColumn: string;
  onTitleColumnChange: (value: string) => void;
  onDescriptionColumnChange: (value: string) => void;
}

export default function ColumnMappingStep({
  headers,
  titleColumn,
  descriptionColumn,
  onTitleColumnChange,
  onDescriptionColumnChange,
}: ColumnMappingStepProps): React.JSX.Element {
  return (
    <UpdateVideoFlowStepTemplate>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Mapear Colunas</h2>
          <p className="mt-1 text-sm text-gray-400">
            O cabeçalho da sua planilha foi extraído e as colunas estarão listadas abaixo.
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Vincule as colunas da sua planilha aos campos do sistema.
          </p>
        </div>

        <Select
          label="Coluna de Título"
          value={titleColumn}
          options={headers}
          onChange={(newValue) => onTitleColumnChange(newValue)}
        />

        <Select
          label="Coluna de Descrição"
          value={descriptionColumn}
          options={headers}
          onChange={(newValue) => onDescriptionColumnChange(newValue)}
        />
      </div>
    </UpdateVideoFlowStepTemplate>
  );
}