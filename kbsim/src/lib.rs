extern crate web_sys;
extern crate wasm_bindgen;

use std::collections::HashMap;
use std::cell::Cell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! rcmut {
    ($e:tt) => (Rc::make_mut(&mut $e))
}

fn create_canvas() -> Result<web_sys::HtmlCanvasElement, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas: web_sys::HtmlCanvasElement = document.create_element("canvas").unwrap()
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();
    canvas.set_width(640);
    canvas.set_height(480);
    Ok(canvas)
}

fn update_canvas(canvas: &web_sys::HtmlCanvasElement, editor: &Editor) -> Result<(), JsValue> {
    let width = canvas.width() as f64;
    let height = canvas.height() as f64;
    let context = canvas
        .get_context("2d")?
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()?;
    context.clear_rect(0.0, 0.0, width, height);
    context.set_text_baseline("top");
    context.set_fill_style(&JsValue::from_str("black"));
    context.set_font("20px monospace");
    context.fill_text(&editor.text, 0.0, 0.0)?;
    context.set_fill_style(&JsValue::from_str("rgba(25, 255, 25, 0.8)"));
    let lpad = context.measure_text(&editor.text[0..(editor.caret_position.col as usize)])?.width();
    context.fill_rect(lpad, 0.0, 2.0, 20.0);
    Ok(())
}

#[derive(Clone)]
struct CaretPosition {
    row: usize,
    col: usize,
}

#[derive(Clone)]
struct Editor {
    text: String,
    caret_position: CaretPosition,
}

impl Editor {
    fn insert_str(&mut self, s: &str) {
        self.text.insert_str(self.caret_position.col, s);
        self.caret_position.col = self.caret_position.col.saturating_add(s.len());
    }
    fn backspace(&mut self) {
        if self.caret_position.col > 0 {
            self.text.replace_range(self.caret_position.col-1..self.caret_position.col, "");
            self.caret_position.col = self.caret_position.col.saturating_sub(1);
        }
    }
    fn move_left(&mut self) {
        self.caret_position.col = self.caret_position.col.saturating_sub(1);
    }
    fn move_right(&mut self) {
        self.caret_position.col = self.caret_position.col.saturating_add(1).min(self.text.len());
    }
}

#[wasm_bindgen]
pub fn greet(name: &str) -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let body = document.body().unwrap();
    let canvas = create_canvas()?;
    body.append_child(&canvas)?;
/*
    let context = canvas
        .get_context("2d")?
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()?;
*/
    let keymap: HashMap<String, String> = [
        ("1","1"),("2","2"),("3","3"),("4","4"),("5","5"),("6","6"),("7","7"),("8","8"),("9","9"),("0","0"),("[","-"),("]","^"),("¥","\\"),
        ("'","q"),(",","w"),(".","e"),("p","r"),("y","t"),("f","y"),("g","u"),("c","i"),("r","o"),("l","p"),("/","@"),("=","["),
        ("a","a"),("o","s"),("e","d"),("u","f"),("i","g"),("d","h"),("h","j"),("t","k"),("n","l"),("s",";"),("-",":"),("\\","]"),
        (";","z"),("q","x"),("j","c"),("k","v"),("x","b"),("b","n"),("m","m"),("w",","),("v","."),("z","/"),("`","_"),
        (" "," ")
    ].iter().map(|(a, b)| (a.to_string(), b.to_string())).collect();

    let editor = Editor {
        text: "Push any key to type text".to_string(),
        caret_position: CaretPosition {row: 0, col: 0}
        };

    let mut editor = Rc::new(editor);
    let canvas = Rc::new(canvas);
    {
        let closure = Closure::wrap(Box::new(move |ev: web_sys::KeyboardEvent| {
            let key = ev.key();
            match &*key {
                "Backspace" => {
                    rcmut!(editor).backspace();
                },
                "ArrowLeft" => {
                    rcmut!(editor).move_left();

                },
                "ArrowRight" => {
                    rcmut!(editor).move_right();
                }
                _ => {
                    keymap.get(&ev.key()).map_or_else(
                        || web_sys::console::log_1(&ev),
                        |k| rcmut!(editor).insert_str(k));
                }
            }
            update_canvas(&canvas, &editor).unwrap();
        }) as Box<dyn FnMut(_)>);
        document.add_event_listener_with_callback("keydown", closure.as_ref().unchecked_ref())?;
        closure.forget();
    }
    window.alert_with_message(&format!("Keyboard Simulator, {}!", name)).expect("could not alert");
    Ok(())
}
