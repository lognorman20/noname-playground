import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { rust, rustLanguage } from "@codemirror/lang-rust";
import { languages } from "@codemirror/language-data";

const placeholder = `// Sample code
fn main(pub xx: [Field; 2]) {
    let cond = xx[0] != xx[1];
    assert(cond);
    let cond2 = xx[0] != 7;
    assert(cond2);
}
`;

function App() {
  const [value, setValue] = React.useState(placeholder);
  const [compilationResult, setCompilationResult] = React.useState("");
  const [assemblyCode, setAssemblyCode] = React.useState("");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  const basicSetupOptions = {
    history: true,
    drawSelection: true,
    foldGutter: true,
    allowMultipleSelections: true,
    bracketMatching: true,
    crosshairCursor: true,
    autocompletion: true,
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        margin: 0,
        padding: 0,
      }}
    >
      <CodeMirror
        value={value}
        placeholder={"Please enter your Noname code here..."}
        width="600px"
        height="100vh"
        theme={"dark"}
        autoFocus={true}
        basicSetup={basicSetupOptions}
        onChange={onChange}
        extensions={rust({ base: rustLanguage, codeLanguages: languages })}
      />
      <div
        style={{
          marginLeft: "10px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          fontSize: "14px",
        }}
      >
        <textarea
          style={{
            width: "100%",
            height: "50%",
            resize: "none",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #444",
            borderRadius: "4px",
            backgroundColor: "#282c35",
            color: "#d4d4d4",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
            fontFamily: "monospace",
            outline: "none",
          }}
          readOnly
          value={compilationResult}
          placeholder="Compilation Results"
        />
        <textarea
          style={{
            width: "100%",
            height: "50%",
            resize: "none",
            padding: "10px",
            border: "1px solid #444",
            borderRadius: "4px",
            backgroundColor: "#282c35",
            color: "#d4d4d4",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
            fontFamily: "monospace",
            outline: "none",
          }}
          readOnly
          value={assemblyCode}
          placeholder="Assembly Code"
        />
      </div>
    </div>
  );
}

export default App;
