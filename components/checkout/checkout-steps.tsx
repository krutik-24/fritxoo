import { CheckCircle } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: "Shipping" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Confirmation" },
  ]

  return (
    <div className="flex justify-center">
      <div className="flex items-center w-full max-w-3xl">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.number < currentStep
                    ? "bg-green-500 text-white"
                    : step.number === currentStep
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number < currentStep ? <CheckCircle className="h-6 w-6" /> : <span>{step.number}</span>}
              </div>
              <span
                className={`mt-2 text-sm ${step.number <= currentStep ? "font-medium text-black" : "text-gray-500"}`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  step.number < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
