import { FC, useState } from "react";
import { CustomMonacoEditor } from "../../../custom-monaco-editor";

export const Editor: FC<{
  defaultValue: string;
  language?: string;
}> = ({ defaultValue, language = "txt" }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <CustomMonacoEditor value={value} onChange={setValue} language={language} />
  );
};
