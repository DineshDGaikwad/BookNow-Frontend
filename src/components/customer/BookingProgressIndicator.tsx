import React from 'react';
import { Check, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface BookingProgressIndicatorProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { id: 'select', title: 'Select Event', description: 'Choose your event and show time' },
  { id: 'seats', title: 'Choose Seats', description: 'Pick your preferred seats' },
  { id: 'details', title: 'Booking Details', description: 'Enter your information' },
  { id: 'payment', title: 'Payment', description: 'Complete your purchase' },
  { id: 'confirmation', title: 'Confirmation', description: 'Booking confirmed' }
];

export const BookingProgressIndicator: React.FC<BookingProgressIndicatorProps> = ({
  currentStep,
  steps = defaultSteps
}) => {
  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <Check className="w-5 h-5 text-white" />;
    } else if (stepIndex === currentStep) {
      return <Clock className="w-5 h-5 text-white" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepClassName = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return "bg-green-500 border-green-500";
    } else if (stepIndex === currentStep) {
      return "bg-blue-500 border-blue-500";
    } else {
      return "bg-gray-200 border-gray-300";
    }
  };

  const getConnectorClassName = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return "bg-green-500";
    } else {
      return "bg-gray-300";
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepClassName(index)}`}
              >
                {getStepIcon(index)}
              </div>
              
              {/* Step Info */}
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className={`text-xs mt-1 max-w-[100px] ${
                  index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-0.5 transition-all duration-300 ${getConnectorClassName(index)}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Current Step Info */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
        </div>
      </div>
    </div>
  );
};