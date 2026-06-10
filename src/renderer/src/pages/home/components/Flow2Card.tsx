import { routes } from "@renderer/common/routes";
import Card from "@renderer/components/Card";
import { FilePenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Flow2Card(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(routes.flow2Page.path)}>
      <FilePenLine />

      <h2> Fluxo de upload 2 </h2>

      <p className="text-justify">
        Faça o upload de uma planilha e mapeie as colunas. Os vídeos upados previamente serão atualizados com as novas informações. (É necessário que os vídeos já estejam no youtube).
      </p>
    </Card>
  );
}