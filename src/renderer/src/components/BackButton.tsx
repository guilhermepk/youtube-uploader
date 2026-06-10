import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton(): React.JSX.Element {
  const navigate = useNavigate();

  function handleClick(): void {
    navigate(-1)
  }

  return (
    <ArrowLeft
      onClick={handleClick}
      width={80}
      height={40}
      className={`
        cursor-pointer
        text-white hover:text-blue-600
        border border-transparent
        hover:shadow-sm shadow-black
        rounded-[10px]
        p-2
      `}
    />
  );
}