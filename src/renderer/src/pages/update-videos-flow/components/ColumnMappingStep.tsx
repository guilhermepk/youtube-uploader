import Flow2StepTemplate from "./Flow2StepTemplate";

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
    <Flow2StepTemplate>
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Coluna de Título
          </label>
          <select
            className="w-full rounded-md border border-gray-600 bg-[#1b1b1f] p-2 text-white outline-none focus:border-blue-500"
            value={titleColumn}
            onChange={(e) => onTitleColumnChange(e.target.value)}
          >
            <option value="" disabled>Selecione uma coluna</option>
            {headers.map((header, index) => (
              <option key={`${header}-${index}`} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Coluna de Descrição
          </label>
          <select
            className="w-full rounded-md border border-gray-600 bg-[#1b1b1f] p-2 text-white outline-none focus:border-blue-500"
            value={descriptionColumn}
            onChange={(e) => onDescriptionColumnChange(e.target.value)}
          >
            <option value="" disabled>Selecione uma coluna</option>
            {headers.map((header, index) => (
              <option key={`${header}-${index}`} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Flow2StepTemplate>
  );
}