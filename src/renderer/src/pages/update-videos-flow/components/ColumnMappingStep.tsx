import Select, { Option as SelectOption } from "@renderer/components/Select";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import MultiSelect from "@renderer/components/MultiSelect";

interface ColumnMappingStepProps { }

export default function ColumnMappingStep({ }: ColumnMappingStepProps): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();
  const headerOptions: Array<SelectOption> = (flowData.extractedHeaders ?? []).map(header => ({ label: header.header, value: header.index }));

  return (
    <UpdateVideoFlowStepTemplate>
      <div className="flex w-full flex-col gap-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Mapear Colunas</h2>
          <p className="mt-1 text-sm text-gray-400">
            O cabeçalho da sua planilha foi extraído e as colunas estarão listadas abaixo.
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Vincule as colunas da sua planilha aos campos do sistema.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 flex-wrap">
          <Select
            defaultText="Escolha uma coluna"
            className="w-50"
            label="Nome"
            value={flowData.firstNameColumn ? { label: flowData.firstNameColumn?.header, value: flowData.firstNameColumn.index } : undefined}
            options={headerOptions}
            onChange={(newValue) => updateFlowData({ firstNameColumn: { header: newValue.label, index: newValue.value } })}
          />

          <Select
            defaultText="Escolha uma coluna"
            className="w-50"
            label="Sobrenome"
            value={flowData.lastNameColumn ? { label: flowData.lastNameColumn?.header, value: flowData.lastNameColumn.index } : undefined}
            options={headerOptions}
            onChange={(newValue) => updateFlowData({ lastNameColumn: { header: newValue.label, index: newValue.value } })}
          />

          <Select
            defaultText="Escolha uma coluna"
            className="w-50"
            label="Setor"
            value={flowData.sectorColumn ? { label: flowData.sectorColumn?.header, value: flowData.sectorColumn.index } : undefined}
            options={headerOptions}
            onChange={(newValue) => updateFlowData({ sectorColumn: { header: newValue.label, index: newValue.value } })}
          />

          <MultiSelect
            className="w-50"
            label="Colunas da descrição"
            value={flowData.descriptionColumns ? flowData.descriptionColumns.map((column) => ({ label: column.header, value: column.index })) : []}
            options={headerOptions}
            onChange={(newValues) => updateFlowData({ descriptionColumns: newValues.map(item => ({ header: item.label, index: item.value })) })}
          />

          <Select
            defaultText="Escolha uma coluna"
            className="w-50"
            label="URL"
            value={flowData.urlColumn ? { label: flowData.urlColumn?.header, value: flowData.urlColumn.index } : undefined}
            options={headerOptions}
            onChange={(newValue) => updateFlowData({ urlColumn: { header: newValue.label, index: newValue.value } })}
          />
        </div>
      </div>
    </UpdateVideoFlowStepTemplate>
  );
}