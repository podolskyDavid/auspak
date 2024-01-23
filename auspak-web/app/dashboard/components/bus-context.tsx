import React, { createContext, useState, useContext } from 'react';

interface BusContextType {
    stopBusClicked: boolean;
  setStopBusClicked: (stopBusClicked: boolean) => void;

  startBusClicked: boolean;
  setStartBusClicked: (startBusClicked: boolean) => void;
  
  nextStopClicked: boolean;
  setNextStopClicked: (nextStopClicked: boolean) => void;

  
}

const BusContext = createContext<BusContextType | null>(null);

export const useBusContext = () => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBusContext must be used within a BusProvider');
  }
  return context;
};

export const BusProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [stopBusClicked, setStopBusClicked] = useState(false);
    const [startBusClicked, setStartBusClicked] = useState(false);
    const [nextStopClicked, setNextStopClicked] = useState(false);

    return (
        <BusContext.Provider value={{
            stopBusClicked, setStopBusClicked,
            startBusClicked, setStartBusClicked,
            nextStopClicked, setNextStopClicked
            // Additional state variables from different components
        }}>
            {children}
        </BusContext.Provider>
    );
}