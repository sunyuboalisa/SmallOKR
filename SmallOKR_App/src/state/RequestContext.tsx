import React, { createContext, useState } from 'react';

type RequestContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};
const RequestContext = createContext<RequestContextType>(null!);

const RequestContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const requestState: RequestContextType = {
    loading: loading,
    setLoading: setLoading,
  };
  return (
    <RequestContext.Provider value={requestState}>
      {children}
    </RequestContext.Provider>
  );
};

export { RequestContext, RequestContextProvider };
