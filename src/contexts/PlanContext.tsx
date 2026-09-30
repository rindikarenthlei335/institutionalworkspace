import React, { createContext, useContext, useState } from 'react';
import { Plan, Feature, planHasFeature } from '../lib/plan';

interface PlanContextValue {
  plan: Plan;
  setPlan: (p: Plan) => void;
  hasFeature: (f: Feature) => boolean;
}

const PlanContext = createContext<PlanContextValue>({
  plan: 'pro',
  setPlan: () => {},
  hasFeature: () => true,
});

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>('pro');
  const hasFeature = (f: Feature) => planHasFeature(plan, f);
  return (
    <PlanContext.Provider value={{ plan, setPlan, hasFeature }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
