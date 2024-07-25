import React from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextareaAutosize,
  IconButton,
} from "@mui/material";
import { GitHub, Article } from "@mui/icons-material";
import CodeMirror from "@uiw/react-codemirror";
import { rust, rustLanguage } from "@codemirror/lang-rust";
import { json, jsonLanguage } from "@codemirror/lang-json";
import { languages } from "@codemirror/language-data";
import "./App.css";

const codePlaceholder = `// Sample code
fn main(pub public_input: Field, private_input: Field) -> Bool {
    let xx = private_input + public_input;
    assert_eq(xx, 2);
    let yy = xx + 6;
    return yy == 8;
}
`;

const publicInputPlaceholder = `{
  "private_input": "1"
}`;
const privateInputPlaceholder = `{
  {"public_input": "1"}
}`;

const basicSetupOptions = {
  history: true,
  drawSelection: true,
  foldGutter: true,
  allowMultipleSelections: true,
  bracketMatching: true,
  crosshairCursor: true,
  autocompletion: true,
};

function App() {
  const [codeValue, setCodeValue] = React.useState(codePlaceholder);
  const [compilationResult, setCompilationResult] = React.useState("");
  const [assemblyCode, setAssemblyCode] = React.useState("");
  const [publicInput, setPublicInput] = React.useState(publicInputPlaceholder);
  const [privateInput, setPrivateInput] = React.useState(
    privateInputPlaceholder,
  );

  const onChange = React.useCallback((val) => {
    setCodeValue(val);
  }, []);

  const onPrivateInputChange = React.useCallback((val) => {
    setPrivateInput(val);
  }, []);

  const onPublicInputChange = React.useCallback((val) => {
    setPublicInput(val);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <Typography variant="h4" gutterBottom>
          Noname Code Playground
        </Typography>
      </header>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Paper sx={{ bgcolor: "#21252d" }} elevation={0}>
            <CodeMirror
              value={codeValue}
              placeholder={"Please enter your Noname code here..."}
              theme={"dark"}
              height="60vh"
              width="100%"
              basicSetup={basicSetupOptions}
              autoFocus={true}
              onChange={onChange}
              extensions={rust({
                base: rustLanguage,
                codeLanguages: languages,
              })}
              className="code-editor"
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction={"column"} spacing={1}>
            <Grid item xs={4}>
              <Grid container direction={"column"} spacing={0}>
                <Grid item xs={6}>
                  <Typography
                    align="center"
                    variant="h5"
                    sx={{ color: "#ffffff" }}
                  >
                    Private Inputs
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <CodeMirror
                    value={privateInput}
                    placeholder={"Private input here"}
                    theme={"dark"}
                    height="22vh"
                    width="100%"
                    basicSetup={basicSetupOptions}
                    autoFocus={true}
                    onChange={onPrivateInputChange}
                    extensions={json({
                      base: jsonLanguage,
                      codeLanguages: languages,
                    })}
                    className="code-editor"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container direction={"column"} spacing={0}>
                <Grid item xs={6}>
                  <Typography
                    align="center"
                    variant="h5"
                    sx={{ color: "#ffffff" }}
                  >
                    Public Inputs
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <CodeMirror
                    value={publicInput}
                    placeholder={"Public input here"}
                    theme={"dark"}
                    height="22vh"
                    width="100%"
                    basicSetup={basicSetupOptions}
                    autoFocus={true}
                    onChange={onPublicInputChange}
                    extensions={json({
                      base: jsonLanguage,
                      codeLanguages: languages,
                    })}
                    className="code-editor"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid
                container
                direction={"row"}
                spacing={3}
                justifyContent="center"
              >
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    disableRipple
                  >
                    Run
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    disableRipple
                  >
                    Generate Assembly
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    disableRipple
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography align="center" sx={{ color: "#ffffff" }} variant="h5">
            Code Output
          </Typography>
          <TextareaAutosize
            minRows={10}
            maxRows={20}
            value={compilationResult}
            readOnly
            placeholder="Compilation result will appear here..."
            style={{
              width: "100%",
              backgroundColor: "#292c34",
              color: "#d4d4d4",
              border: "1px solid #444",
              borderRadius: "4px",
              padding: "10px",
              fontFamily: "monospace",
              fontSize: "14px",
              resize: "none",
              boxSizing: "border-box",
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography align="center" sx={{ color: "#ffffff" }} variant="h5">
            Assembly Output
          </Typography>
          <TextareaAutosize
            minRows={10}
            maxRows={20}
            value={assemblyCode}
            readOnly
            placeholder="Assembly code will appear here..."
            style={{
              width: "100%",
              backgroundColor: "#292c34",
              color: "#d4d4d4",
              border: "1px solid #444",
              borderRadius: "4px",
              padding: "10px",
              fontFamily: "monospace",
              fontSize: "14px",
              resize: "none",
              boxSizing: "border-box",
            }}
          />
        </Grid>
        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <IconButton
            href="https://github.com/zksecurity/noname"
            target="_blank"
            aria-label="GitHub"
          >
            <GitHub sx={{ fontSize: 24, color: "#ffffff" }} />
          </IconButton>
          <IconButton
            href="https://zksecurity.github.io/noname"
            target="_blank"
            aria-label="Documentation"
          >
            <Article sx={{ fontSize: 24, color: "#ffffff" }} />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
