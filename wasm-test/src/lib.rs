extern crate web_sys;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use web_sys::Window;

#[wasm_bindgen]
pub fn greet(name: &str) {
    let window = web_sys::window().unwrap();
    window.alert_with_message(&format!("Hello, {}!", name)).expect("could not alert");
}
