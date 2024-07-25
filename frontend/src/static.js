export const codePlaceholder = `// Sample code
fn main(pub public_input: Field, private_input: Field) -> Bool {
    let xx = private_input + public_input;
    assert_eq(xx, 2);
    let yy = xx + 6;
    return yy == 8;
}
`;

export const privateInputPlaceholder = `{
  "private_input": "1"
}`;

export const publicInputPlaceholder = `{
  "public_input": "1"
}`;

export const basicSetupOptions = {
  history: true,
  drawSelection: true,
  foldGutter: true,
  allowMultipleSelections: true,
  bracketMatching: true,
  crosshairCursor: true,
  autocompletion: true,
};
