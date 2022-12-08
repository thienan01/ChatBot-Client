import { useState, createContext, useMemo } from "react";
const ScriptContext = createContext();

function ScriptProvider({ children }) {
  const [script, setSCript] = useState({});
  const provided = useMemo(
    () => ({
      value: script,
      setValue: (value) => setSCript(value),
    }),
    [script]
  );
  return (
    <ScriptContext.Provider value={provided}>{children}</ScriptContext.Provider>
  );
}

export { ScriptContext, ScriptProvider };
