import { useState } from "react";

const memorize = {};
const useStateMemorize = (initValue, memorizeKey) => {
  const initState =
    memorize[memorizeKey] !== undefined ? memorize[memorizeKey] : initValue;
  const [state, setState] = useState(initState);

  const customSetState = (newValue) => {
    setState(newValue);
    memorize[memorizeKey] = newValue;
  };

  return [state, customSetState];
};

export default useStateMemorize;
