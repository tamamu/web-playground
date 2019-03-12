
TARGET=kbsim.wasm

all: $(TARGET)

$(TARGET): $(wildcard src/*.rs)
	cargo +nightly build --target wasm32-unknown-unknown
	wasm-bindgen target/wasm32-unknown-unknown/debug/$(TARGET) --out-dir .

serve:
	npm run serve

deploy:
	npx webpack
