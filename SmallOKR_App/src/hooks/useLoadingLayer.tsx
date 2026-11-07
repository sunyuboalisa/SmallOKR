import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

type LoadingLayerContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingLayerContext = createContext<LoadingLayerContextType | undefined>(
  undefined,
);
const LoadingActionsContext = createContext<
  | {
      beginRequest: () => void;
      endRequest: () => void;
    }
  | undefined
>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(0);
  const beginRequest = useCallback(() => setPending(count => count + 1), []);
  const endRequest = useCallback(
    () => setPending(count => Math.max(0, count - 1)),
    [],
  );
  const actions = useMemo(
    () => ({ beginRequest, endRequest }),
    [beginRequest, endRequest],
  );
  const visible = loading || pending > 0;
  const value = useMemo(() => ({ loading: visible, setLoading }), [visible]);

  return (
    <LoadingActionsContext.Provider value={actions}>
      <LoadingLayerContext.Provider value={value}>
        {children}
      </LoadingLayerContext.Provider>
    </LoadingActionsContext.Provider>
  );
};

export const useLoadingActions = () => {
  const context = useContext(LoadingActionsContext);
  if (!context)
    throw new Error('useLoadingActions must be used within a LoadingProvider');
  return context;
};

export const useLoadingLayer = (): LoadingLayerContextType => {
  const context = useContext(LoadingLayerContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
