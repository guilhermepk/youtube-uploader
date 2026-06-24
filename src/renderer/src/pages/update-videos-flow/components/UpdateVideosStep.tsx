import { UpdateVideosDto } from "@shared/models/dtos/upload-flow-manager/update-videos.dto";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import { useEffect, useState } from "react";
import Table from "@renderer/components/Table";
import { ResultInUpdateVideosResponse } from "@shared/models/responses/upload-flows-manager/update-videos.response";
import toast from 'react-hot-toast';

export default function UpdateVideosStep(): React.JSX.Element {
  const { flowData } = useUpdateVideosFlow();
  const [flowStatus, setFlowStatus] = useState<'pending' | 'started' | 'ended'>('pending');
  const [rows, setRows] = useState<Array<ResultInUpdateVideosResponse>>([]);

  async function updateVideos(): Promise<void> {
    setFlowStatus('started');

    const {
      playlist,
      firstNameColumn,
      lastNameColumn,
      sectorColumn,
      descriptionColumns,
      sheetPath
    } = flowData;

    if (!playlist || !firstNameColumn || !lastNameColumn || !sectorColumn || !sheetPath) {
      toast('Campos ausentes');
      return;
    }

    if (!playlist.id) {
      toast('ID da playlist ausente');
      return;
    }

    const { itemCount: playlistItemCount } = playlist.contentDetails ?? {};
    if (playlistItemCount === undefined || playlistItemCount === null) {
      toast('"itemCount" ausente na playlist');
      return;
    }

    const { title: playlistTitle } = playlist.snippet ?? {};
    if (!playlistTitle) {
      toast('Nome da playlist ausente');
      return;
    }

    const dto: UpdateVideosDto = {
      playlist: {
        id: playlist.id,
        itemCount: playlistItemCount,
        name: playlistTitle
      },
      sheetInfo: {
        filePath: sheetPath,
        firstNameColumnIndex: firstNameColumn.index,
        lastNameColumnIndex: lastNameColumn.index,
        sectorColumnIndex: sectorColumn.index,
        descriptionColumnIndexes: descriptionColumns ? descriptionColumns.map(item => item.index) : []
      }
    };

    const response = await window.api.uploadFlowsManager.updateVideos(dto);

    if (response.success) {
      const { results } = response.data;
      // const stringResults = results.map(item => `${item.rowIndex} - ${item.success ? 'sucesso' : 'falha'} - ${item.error}`);
      // toast(`Resultado:\n\n${stringResults.join(';\n')}`);
      setRows(results);
      setFlowStatus('ended');
    } else {
      const { code, message, details } = response.error;
      toast(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  useEffect(() => {
    updateVideos();
  }, []);

  return (
    <UpdateVideoFlowStepTemplate>
      {flowStatus === 'pending' && (
        <p className="text-white">As informações dos vídeos serão atualizadas</p>
      )}

      {flowStatus === 'started' && (
        <p className="text-white">Os vídeos estão sendo atualizados</p>
      )}

      {flowStatus === 'ended' && (
        <div className="h-full flex flex-col items-center justify-center gap-4 select-text">
          <p className="text-white">O fluxo terminou.</p>

          <Table
            headers={['Linha', 'Capa', 'Título', 'Link', 'Resultado']}
            rows={rows.map(row => [
              { value: String(row.rowIndex) },
              row.uploadData?.thumbnailUrl ? { value: <img src={row.uploadData.thumbnailUrl} width={75} height={75} /> } : { value: 'Indefinido', className: 'opacity-50' },
              row.uploadData?.title ? { value: row.uploadData.title } : { value: 'Indefinido', className: 'opacity-50' },
              row.uploadData?.url ? { value: <a className="hover:text-blue-500" target="blank" href={row.uploadData.url}>{row.uploadData.url}</a> } : { value: 'Indefinido', className: 'opacity-50' },
              {
                className: `${row.error == null ? 'text-[rgb(50,255,50)]' : 'text-[red]'}`,
                value: row.error === null ? 'Sucesso' : row.error
              }
            ])}
          />
        </div>
      )}
    </UpdateVideoFlowStepTemplate>
  );
}