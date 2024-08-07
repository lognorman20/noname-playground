import React from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextareaAutosize,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { GitHub, Article } from "@mui/icons-material";
import CodeMirror from "@uiw/react-codemirror";
import { rust, rustLanguage } from "@codemirror/lang-rust";
import { json, jsonLanguage } from "@codemirror/lang-json";
import { languages } from "@codemirror/language-data";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import "./App.css";
import {
  codePlaceholder,
  publicInputPlaceholder,
  privateInputPlaceholder,
  basicSetupOptions,
  EXAMPLES,
} from "./static";

function App() {
  const [codeValue, setCodeValue] = React.useState(codePlaceholder);
  const [compilationResult, setCompilationResult] = React.useState("");
  const [assemblyCode, setAssemblyCode] = React.useState("");
  const [proofOutput, setProofOutput] = React.useState("");
  const [publicInput, setPublicInput] = React.useState(publicInputPlaceholder);
  const [privateInput, setPrivateInput] = React.useState(
    privateInputPlaceholder,
  );
  const [selectedBackend, setSelectedBackend] = React.useState("kimchi-vesta");
  const [selectedExample, setSelectedExample] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("info");

  const onChange = React.useCallback((val) => {
    setCodeValue(val);
  }, []);

  const onPrivateInputChange = React.useCallback((val) => {
    setPrivateInput(val);
  }, []);

  const onPublicInputChange = React.useCallback((val) => {
    setPublicInput(val);
  }, []);

  const handleExampleChange = (event) => {
    const exampleKey = event.target.value;
    setSelectedExample(exampleKey);
    const example = EXAMPLES[exampleKey];
    setCodeValue(example.code);
    setPublicInput(example.public_input);
    setPrivateInput(example.private_input);
  };

  function BackendSelector() {
    const MenuProps = {
      PaperProps: {
        sx: {
          bgcolor: "#292c34",
          color: "white",
          "& .MuiMenuItem-root": {
            padding: 1,
          },
        },
      },
    };

    return (
      <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
        <InputLabel id="backend-selector-label" sx={{ color: "white" }}>
          Select Backend
        </InputLabel>
        <Select
          labelId="backend-selector-label"
          id="backend-selector"
          value={selectedBackend}
          label="Select Backend"
          onChange={(e) => setSelectedBackend(e.target.value)}
          MenuProps={MenuProps}
          sx={{
            backgroundColor: "#292c34",
            color: "white",
            ".MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            ".MuiSvgIcon-root": {
              color: "white",
            },
          }}
        >
          <MenuItem value="kimchi-vesta">Kimchi-Vesta</MenuItem>
          <MenuItem value="r1cs-bls12-381">R1CS-BLS12-381</MenuItem>
          <MenuItem value="r1cs-bn254">R1CS-BN254</MenuItem>
        </Select>
      </FormControl>
    );
  }

  function ExampleSelector() {
    const MenuProps = {
      PaperProps: {
        sx: {
          bgcolor: "#292c34",
          color: "white",
          "& .MuiMenuItem-root": {
            padding: 1,
          },
        },
      },
    };

    return (
      <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
        <InputLabel id="example-selector-label" sx={{ color: "white" }}>
          Select Example
        </InputLabel>
        <Select
          labelId="example-selector-label"
          id="example-selector"
          value={selectedExample}
          label="Select Example"
          onChange={handleExampleChange}
          MenuProps={MenuProps}
          sx={{
            backgroundColor: "#292c34",
            color: "white",
            ".MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            ".MuiSvgIcon-root": {
              color: "white",
            },
          }}
        >
          {Object.keys(EXAMPLES).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  function showSnackbar(message, severity = "info") {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  function handleRun() {
    showSnackbar("Running...");

    // Validate public info JSON
    try {
      JSON.parse(publicInput);
    } catch (e) {
      setCompilationResult("Invalid public input JSON");
      showSnackbar("Invalid public input JSON", "error");
      return;
    }

    // Validate private info JSON
    try {
      JSON.parse(privateInput);
    } catch (e) {
      setCompilationResult("Invalid private input JSON");
      showSnackbar("Invalid private input JSON", "error");
      return;
    }

    // Send request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      code: codeValue,
      public_input: publicInput,
      private_input: privateInput,
      backend: selectedBackend, // Use the selected backend
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://noname-playground.onrender.com/run", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCompilationResult(
          result.response ? result.response : "No response key found",
        );
        showSnackbar("Run completed successfully!", "success");
      })
      .catch((error) => {
        setCompilationResult("Error fetching data | " + error);
        showSnackbar("Error running code", "error");
        console.error(error);
      });

    console.log("Successfully ran code");
  }

  function generateAsm() {
    showSnackbar("Generating Assembly...");

    // Validate public info JSON
    try {
      JSON.parse(publicInput);
    } catch (e) {
      setCompilationResult("Invalid public input JSON");
      showSnackbar("Invalid public input JSON", "error");
      return;
    }

    // Validate private info JSON
    try {
      JSON.parse(privateInput);
    } catch (e) {
      setCompilationResult("Invalid private input JSON");
      showSnackbar("Invalid private input JSON", "error");
      return;
    }

    // Send request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      code: codeValue,
      public_input: publicInput,
      private_input: privateInput,
      backend: selectedBackend, // Use the selected backend
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://noname-playground.onrender.com/get_asm", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setAssemblyCode(
          result.response ? result.response : "No response key found",
        );
        showSnackbar("Assembly code generated successfully!", "success");
      })
      .catch((error) => {
        setAssemblyCode("Error fetching data | " + error);
        showSnackbar("Error generating assembly", "error");
        console.error(error);
      });

    console.log("Successfully generated ASM code");
  }

  function handleProve() {
    showSnackbar("Proving...", "info");

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://noname-playground.onrender.com/prove", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // Regular expression to match and remove ANSI escape sequences
        const ansiEscapeRegex = /\x1B\[([0-9;]*[a-zA-Z])/g;

        // Remove ANSI escape sequences from the logs
        let cleanedLogs = result.response.replace(ansiEscapeRegex, '');

        // Regular expression to find the log entries and reformat them
        const logEntryRegex = /\[INFO\]  snarkJS: (.*?)(?=\[INFO\]|$)/gs;

        // Extract and join the matched groups
        const matches = cleanedLogs.matchAll(logEntryRegex);
        const output = Array.from(matches, match => `[INFO]  snarkJS: ${match[1]}`).join('\n');
        setProofOutput(
          result.response ? output : "No response key found",
        );
        showSnackbar("Proof generated successfully!", "success");
        console.log(result);
      })
      .catch((error) => {
        setProofOutput("Error fetching proof | " + error);
        showSnackbar("Error generating proof", "error");
        console.error(error);
      });
    console.log("Successfully generated proof");
  }

  function handleSaveCode() {
    showSnackbar("Saving code...");

    const blob = new Blob([codeValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "main.no";
    link.click();

    showSnackbar("Code saved successfully!", "success");
  }

  function handleSaveProof() {
    showSnackbar("Saving proof (unimplemented)...");

    const blob = new Blob([codeValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "main.no";
    link.click();

    showSnackbar("Proof saved successfully! (sike lol)", "success");
  }

  return (
    <div className="app-container">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <header className="app-header">
        <Typography variant="h4" gutterBottom>
          Noname Code Playground
        </Typography>
      </header>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Paper sx={{ bgcolor: "#21252d" }} elevation={0}>
            <CodeMirror
              value={codeValue}
              placeholder={"Please enter your Noname code here..."}
              theme={"dark"}
              height="75vh"
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
        <Grid item xs={5}>
          <Grid container direction={"column"} spacing={1}>
            <Grid item xs={2}>
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
                    height="20vh"
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
            <Grid item xs={2}>
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
                    height="20vh"
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
            <Grid item xs="auto">
              <Grid
                container
                direction={"row"}
                spacing={3}
                justifyContent="center"
              >
                <Grid item xs={6}>
                  <ExampleSelector />
                </Grid>
                <Grid item xs={6}>
                  <BackendSelector />
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
                    onClick={handleRun}
                  >
                    Run
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    disableRipple
                    onClick={generateAsm}
                  >
                    Generate Assembly
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    onClick={handleProve}
                    disableRipple
                  >
                    Prove
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    onClick={handleSaveCode}
                    disableRipple
                  >
                    Save Code
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    sx={{ backgroundColor: "#292c34", color: "#ffffff" }}
                    onClick={handleSaveProof}
                    disableRipple
                  >
                    Save Proof
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <Typography align="center" sx={{ color: "#ffffff" }} variant="h5">
            Code Output
          </Typography>
          <TextareaAutosize
            minRows={10}
            maxRows={15}
            value={compilationResult}
            readOnly
            placeholder="Compilation result will appear here..."
            style={{
              width: "100%",
              backgroundColor: "#292c34",
              color: "#d4d4d4",
              height: "6vh",
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
        <Grid item xs={5}>
          <Grid container direction={"column"} spacing={0}>
            <Grid item xs={4}>
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
            <Grid item xs={3}>
              <Typography align="center" sx={{ color: "#ffffff" }} variant="h5">
                Proof Output
              </Typography>
              <TextareaAutosize
                minRows={10}
                maxRows={20}
                value={proofOutput}
                readOnly
                placeholder="Proof output details will appear here..."
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
          </Grid>
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
