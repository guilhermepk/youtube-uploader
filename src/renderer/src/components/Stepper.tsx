import { Check } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export interface StepItem {
  title: string;
  description?: string;
  content: ReactNode;
  onPrevStep?: (currentStepIndex: number) => void;
  onNextStep?: (currentStepIndex: number) => void;
}

interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onPrevStep?: (currentStepIndex: number) => void;
  onNextStep?: (currentStepIndex: number) => void;
}

export function Stepper({ steps, currentStepIndex, onNextStep, onPrevStep }: StepperProps) {
  const [currentStep, setCurrentStep] = useState<StepItem>(steps[currentStepIndex]);

  function handleNextStep(): void {
    currentStep.onNextStep ? currentStep.onNextStep(currentStepIndex) : onNextStep?.(currentStepIndex)
  }

  function handlePrevStep(): void {
    currentStep.onPrevStep ? currentStep.onPrevStep(currentStepIndex) : onPrevStep?.(currentStepIndex)
  }

  useEffect(() => {
    setCurrentStep(steps[currentStepIndex]);
  }, [currentStepIndex]);

  return (
    <div className="w-full h-full p-8">
      <Header steps={steps} currentStepIndex={currentStepIndex} />

      <div className="w-full">
        {currentStep.content}
      </div>

      {/* Controles */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
        >
          Voltar
        </button>
        <button
          onClick={handleNextStep}
          disabled={currentStepIndex === steps.length - 1}
        >
          {currentStepIndex === steps.length - 1 ? "Finalizar" : "Próximo"}
        </button>
      </div>
    </div>
  );
}

interface HeaderProps {
  steps: StepItem[];
  currentStepIndex: number;
}

function Header({ steps, currentStepIndex }: HeaderProps): React.JSX.Element {
  return (
    <div className="relative flex w-full flex-row justify-between">
      {/* Linha de fundo (cinza) */}
      <div className="absolute left-0 top-4 -z-10 flex h-[2px] w-full items-center px-4">
        <div className="h-full w-full bg-gray-200" />
      </div>

      {/* Linha de progresso (azul) */}
      <div className="absolute left-0 top-4 -z-10 flex h-[2px] w-full items-center px-4">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Renderização das etapas */}
      {steps.map((step, index) => {
        const isCompleted = currentStepIndex > index;
        const isActive = currentStepIndex === index;

        return (
          <div key={step.title} className="flex flex-col items-center gap-2 px-2">

            {/* Bolinha da Etapa */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${isCompleted
                ? "border-blue-600 bg-blue-600 text-white" // Etapa concluída
                : isActive
                  ? "border-blue-600 bg-white text-blue-600" // Etapa atual
                  : "border-gray-300 bg-white text-gray-500" // Etapa futura
                }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>

            {/* Textos */}
            <div className="flex flex-col items-center text-center">
              <span
                className={`text-sm font-medium text-white ${isActive ? "opacity-100" : "opacity-50"
                  }`}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="text-xs text-gray-400">
                  {step.description}
                </span>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}