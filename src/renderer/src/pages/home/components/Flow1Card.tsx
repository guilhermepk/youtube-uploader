import { routes } from "@renderer/common/routes";
import Card from "@renderer/components/Card";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Flow1Card(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(routes.fullFlowPage.path)}>
      <Upload />

      <h2> Fluxo completo </h2>

      <p className="text-justify">
        Faça o upload de uma planilha, mapeie as colunas e anexe os arquivos de vídeo para envio direto ao YouTube.
      </p>
    </Card>
  );
}