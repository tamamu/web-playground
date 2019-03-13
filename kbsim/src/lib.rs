extern crate web_sys;
extern crate wasm_bindgen;

use std::collections::HashMap;
use std::cell::RefCell;
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

macro_rules! make_mut {
    ($e:expr) => (Rc::make_mut(&mut $e))
}

macro_rules! closure {
    ($e:expr) => (Closure::wrap(Box::new($e) as Box<dyn FnMut(_)>))
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
    context.set_fill_style(&JsValue::from_str("rgba(0, 0, 0, 0.5)"));
    context.clear_rect(0.0, 0.0, width, height);
    context.fill_rect(0.0, 0.0, width, height);
    context.set_text_baseline("top");
    context.set_fill_style(&JsValue::from_str("black"));
    context.set_font("20px monospace");
    context.fill_text(&editor.text, 0.0, 0.0)?;
    context.set_fill_style(&JsValue::from_str("rgba(25, 255, 25, 0.8)"));
    let lpad = context.measure_text(&editor.text[0..(editor.caret_position.col as usize)])?.width();
    context.fill_rect(lpad, 0.0, 2.0, 20.0);
    Ok(())
}

fn create_draggable(text: &str) -> Result<web_sys::HtmlElement, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let div = document.create_element("div").unwrap()
        .dyn_into::<web_sys::HtmlElement>()
        .map_err(|_| ())
        .unwrap();
    div.set_attribute("draggable", "true")?;
    div.set_attribute("data-key", text)?;
    div.set_inner_html(text);
    Ok(div)
}

fn create_key_container() -> Result<web_sys::HtmlElement, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let div = document.create_element("div").unwrap()
        .dyn_into::<web_sys::HtmlElement>()
        .map_err(|_| ())
        .unwrap();
    div.set_id("key_container");
    div.style().set_property("width", "600px").unwrap();
    Ok(div)
}

fn create_style(decl: &str) -> Result<web_sys::HtmlStyleElement, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let style = document.create_element("style").unwrap()
        .dyn_into::<web_sys::HtmlStyleElement>()
        .map_err(|_| ())
        .unwrap();
    style.set_inner_html(decl);
    Ok(style)
}


fn apply_style_keytop(elem: &web_sys::HtmlElement) {
    elem.style().set_property("display", "inline-block").unwrap();
    elem.style().set_property("width", "36px").unwrap();
    elem.style().set_property("height", "32px").unwrap();
    elem.style().set_property("margin", "0px 4px").unwrap();
    elem.style().set_property("padding-bottom", "6px").unwrap();
    elem.style().set_property("border", "1px solid black").unwrap();
    elem.style().set_property("border-radius", "6px").unwrap();
    elem.style().set_property("text-transform", "uppercase").unwrap();
}

use std::cell::RefMut;
fn swap_key(mut km: RefMut<HashMap<String, String>>, key1: &web_sys::HtmlElement, key2: &web_sys::HtmlElement) {
    let key1_top = key1.inner_html();
    let key2_top = key2.inner_html();
    let key1_btn = key1.get_attribute("data-key").unwrap();
    let key2_btn = key2.get_attribute("data-key").unwrap();
    console_log!("{}(key:{}) <=> {}(key:{})", key1_top, key1_btn, key2_top, key2_btn);
    key1.set_inner_html(&key2_top);
    key2.set_inner_html(&key1_top);
    km.insert(key1_btn, key2_top);
    km.insert(key2_btn, key1_top);
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
    let style = create_style("
        #key_container div:nth-child(5) div {
            width: 100%;
        }
    ")?;
    let canvas = create_canvas()?;
    let key_container = create_key_container()?;
    body.append_child(&style)?;
    body.append_child(&canvas)?;
    body.append_child(&key_container)?;
/*
    let context = canvas
        .get_context("2d")?
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()?;
*/
    let keyboard_model = vec![
        vec!["1","2","3","4","5","6","7","8","9","0","[","]"],
        vec!["'",",",".","p","y","f","g","c","r","l","/","=", "\\"],
        vec!["a","o","e","u","i","d","h","t","n","s","-"],
        vec![";","q","j","k","x","b","m","w","v","z"],
        vec![" "]
    ];
    /*
    let keymap: HashMap<String, String> = [
        ("1","1"),("2","2"),("3","3"),("4","4"),("5","5"),("6","6"),("7","7"),("8","8"),("9","9"),("0","0"),("[","-"),("]","^"),("¥","\\"),
        ("'","q"),(",","w"),(".","e"),("p","r"),("y","t"),("f","y"),("g","u"),("c","i"),("r","o"),("l","p"),("/","@"),("=","["),
        ("a","a"),("o","s"),("e","d"),("u","f"),("i","g"),("d","h"),("h","j"),("t","k"),("n","l"),("s",";"),("-",":"),("\\","]"),
        (";","z"),("q","x"),("j","c"),("k","v"),("x","b"),("b","n"),("m","m"),("w",","),("v","."),("z","/"),("`","_"),
        (" "," ")
    ].iter().map(|(a, b)| (a.to_string(), b.to_string())).collect();
    */
    let keymap: HashMap<String, String> = keyboard_model
        .iter().flat_map(|v|v.iter().map(|k| (k.to_string(), k.to_string()))).collect();
    let keytops: HashMap<String, web_sys::HtmlElement> = keymap.keys()
        .map(|k| (k.clone(), create_draggable(&k).unwrap())).collect();
    for line in keyboard_model {
        let kline = document.create_element("div").unwrap()
            .dyn_into::<web_sys::HtmlElement>()
            .map_err(|_| ())
            .unwrap();
        for key in line.iter() {
            let draggable = keytops.get(*key).unwrap();
            apply_style_keytop(draggable);
            kline.append_child(&draggable)?;
        }
        key_container.append_child(&kline)?;
    }

    let editor = Editor {
        text: "Push any key to type text".to_string(),
        caret_position: CaretPosition {row: 0, col: 0}
        };

    let drag_src_element: Option<Box<web_sys::HtmlElement>> = None;
    let dse = Rc::new(RefCell::new(drag_src_element));

    let km = Rc::new(RefCell::new(keymap));

    for draggable in keytops.values() {
        let dse1 = dse.clone();
        let dse2 = dse.clone();
        {
            let closure = closure!(move |ev: web_sys::DragEvent| {
                let target = ev.target().unwrap().dyn_into::<web_sys::HtmlElement>().unwrap();
                target.style().set_property("opacity", "0.4").unwrap();
                web_sys::console::log_1(&ev.target().unwrap());
                let dt = ev.data_transfer().unwrap();
                dt.set_effect_allowed("move");
                dt.set_data("text/html", &target.inner_html()).unwrap();
                *dse1.borrow_mut() = Some(Box::new(target));
                web_sys::console::log_1(&dt);
                web_sys::console::log_1(&JsValue::from_str(&dt.get_data("text/html").unwrap()));
            });
            draggable.add_event_listener_with_callback("dragstart", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let closure = closure!(move |ev: web_sys::DragEvent| {
                let target = ev.target().unwrap().dyn_into::<web_sys::HtmlElement>().unwrap();
                target.style().set_property("opacity", "1.0").unwrap();
                web_sys::console::log_1(&ev);
                console_log!("dragend");
            });
            draggable.add_event_listener_with_callback("dragend", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let closure = closure!(move |ev: web_sys::DragEvent| {
                let target = ev.target().unwrap().dyn_into::<web_sys::HtmlElement>().unwrap();
                target.style().set_property("border", "1px solid red").unwrap();
                web_sys::console::log_1(&ev.target().unwrap());
            });
            draggable.add_event_listener_with_callback("dragenter", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let closure = closure!(move |ev: web_sys::DragEvent| {
                ev.prevent_default();
            });
            draggable.add_event_listener_with_callback("dragover", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let closure = closure!(move |ev: web_sys::DragEvent| {
                let target = ev.target().unwrap().dyn_into::<web_sys::HtmlElement>().unwrap();
                target.style().set_property("border", "1px solid black").unwrap();
                web_sys::console::log_1(&ev);
            });
            draggable.add_event_listener_with_callback("dragleave", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        let km1 = km.clone();
        {
            let closure = closure!(move |ev: web_sys::DragEvent| {
                let target = ev.target().unwrap().dyn_into::<web_sys::HtmlElement>().unwrap();
                let dt = ev.data_transfer().unwrap();
                ev.stop_propagation();
                ev.prevent_default();
                console_log!("drop");
                web_sys::console::log_1(&dt);
                match dse2.borrow().as_ref() {
                    Some(elem) => {
                        if !elem.is_same_node(Some(&target)) {
                            swap_key(km1.borrow_mut(), &elem, &target);
                            target.style().set_property("border", "1px solid black").unwrap();
                        }
                    }
                    _ => {}
                };
            });
            draggable.add_event_listener_with_callback("drop", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
    }

    let mut editor = Rc::new(editor);
    let canvas = Rc::new(canvas);
    let km1 = km.clone();
    {
        let closure = closure!(move |ev: web_sys::KeyboardEvent| {
            let key = ev.key();
            match &*key {
                "Backspace" => {
                    make_mut!(editor).backspace();
                },
                "ArrowLeft" => {
                    make_mut!(editor).move_left();

                },
                "ArrowRight" => {
                    make_mut!(editor).move_right();
                }
                _ => {
                    km1.borrow().get(&ev.key()).map_or_else(
                        || web_sys::console::log_1(&ev),
                        |k| make_mut!(editor).insert_str(k));
                }
            }
            update_canvas(&canvas, &editor).unwrap();
        });
        document.add_event_listener_with_callback("keydown", closure.as_ref().unchecked_ref())?;
        closure.forget();
    }
    window.alert_with_message(&format!("Keyboard Simulator, {}!", name)).expect("could not alert");
    Ok(())
}
