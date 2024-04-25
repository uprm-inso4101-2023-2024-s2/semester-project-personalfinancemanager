import React, { createContext, useContext, useState } from 'react';

export const GraphContext = createContext();

export const useGraph = () => useContext(GraphContext);

export default function GraphProvider ({ children }) {
  const [showGraph, setShowGraph] = useState(false);

  const toggleGraphs = () => {
    setShowGraph((prev) => !prev);
  };

  return (
    <GraphContext.Provider value={{ showGraph, toggleGraphs }}>
      {children}
    </GraphContext.Provider>
  );
};
