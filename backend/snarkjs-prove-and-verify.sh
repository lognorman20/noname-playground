#!/bin/bash

# This script generates a cryptographic proof and verifies it using snarkjs.
# Original script by @katat: https://gist.github.com/katat/7482d07ae783a5b20a4e5f04dec4cb16#file-snarkjs-prove-and-verify-sh

# Check if directory path argument is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <directory_path>"
    exit 1
fi

DIR_PATH=$1
CURVE="bn128"
NEW_PTAU=false

# Check for optional setup flag
for arg in "$@"; do
    if [[ $arg == "--new" ]]; then
        NEW_PTAU=true
    fi
done

# Generate a proof and verify it via snarkjs
if $NEW_PTAU; then
    snarkjs powersoftau new $CURVE 16 "ptau/pot_"$CURVE"_0000.ptau" -v
    echo "WADDUP" | snarkjs powersoftau contribute "ptau/pot_"$CURVE"_0000.ptau" "ptau/pot_"$CURVE"_0001.ptau" --name="First contribution" -v
    snarkjs powersoftau prepare phase2 "ptau/pot_"$CURVE"_0001.ptau" "ptau/pot_"$CURVE"_final.ptau" -v
fi

# Check the consistency between the witness and r1cs constraints via snarkjs
snarkjs wchk "$DIR_PATH/output.r1cs" "$DIR_PATH/output.wtns"
snarkjs groth16 setup "$DIR_PATH/output.r1cs" "ptau/pot_"$CURVE"_final.ptau" "proof/test_"$CURVE"_0000.zkey"
echo "SPOTEMGOTEM" | snarkjs zkey contribute "proof/test_"$CURVE"_0000.zkey" "proof/test_"$CURVE"_0001.zkey" --name="1st Contributor Name" -v
snarkjs zkey export verificationkey "proof/test_"$CURVE"_0001.zkey" "proof/verification_key.json"
snarkjs groth16 prove "proof/test_"$CURVE"_0001.zkey" "$DIR_PATH/output.wtns" "proof/proof.json" "proof/public.json"
snarkjs groth16 verify "proof/verification_key.json" "proof/public.json" "proof/proof.json"

# Export the verifier contract and calldata via snarkjs
snarkjs zkey export solidityverifier "proof/test_"$CURVE"_0001.zkey" proof/verifier.sol
echo "calldata to test:"
snarkjs zkey export soliditycalldata proof/public.json proof/proof.json
