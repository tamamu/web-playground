#!/bin/bash

put_proc() {
  echo $(tput setaf 3)* $1...$(tput sgr0)
}

put_comp() {
  echo $(tput setaf 2)✔ $1$(tput sgr0)
}

put_fail() {
  echo $(tput setaf 1)✗ $1$(tput sgr0)
}

put_proc "Check the system has rustup"
if [ ! `which rustup` ]; then
  put_fail "Not found command: rustup"
  echo "Please install rustup with following command:"
  echo '$ curl https://sh.rustup.rs -sSf | sh'
  exit 1
fi
put_comp "Found rustup on the system"

put_proc "Check rustup active toolchain"
echo "$(rustup show active-toolchain) is active now"
if [[ ! $(rustup show active-toolchain) == nightly* ]]; then
  put_proc "Switch toolchain to nightly"
  rustup default nightly
  if [ ! $? = 0 ]; then
    put_fail "Failed to switch toolchain to nightly"
    exit 1
  fi
  put_comp "Nightly is active now"
fi

put_proc "Download Rust target: wasm32-unknown-unknown"
rustup target add wasm32-unknown-unknown --toolchain nightly
if [ $? = 0 ]; then
  put_comp "Installed wasm32-unknown-unknown"
else
  put_fail "Failed to install wasm32-unknown-unknown"
  exit 1
fi

if [ `which cargo` ]; then
  if [ ! `which wasm-bindgen` ]; then
    put_proc "Download wasm-bindgen tools"
    cargo +nightly install wasm-bindgen-cli
    if [ $? = 0 ]; then
      put_comp "Installed wasm-bindgen-cli"
    else
      put_fail "Failed to install wasm-bindgen-cli"
      exit 1
    fi
  fi
  put_comp "Installed wasm-bindgen-cli"
else
  put_fail "Not found command: cargo"
  echo 'Check your $PATH'
  exit 1
fi

put_comp "Complete bootstrap"

