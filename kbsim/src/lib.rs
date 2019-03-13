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
    canvas.set_width(820);
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
    context.set_fill_style(&JsValue::from_str("rgba(0, 0, 0, 1)"));
    context.clear_rect(0.0, 0.0, width, height);
    context.fill_rect(0.0, 0.0, width, height);
    context.set_text_baseline("top");
    context.set_fill_style(&JsValue::from_str("white"));
    context.set_font("20px monospace");
    for (i, line) in editor.text.lines().enumerate() {
        context.fill_text(line, 8.0, 8.0+20.0*i as f64)?;
    }
    let mut last_head = 0usize;
    let mut row = 0;
    let mut col = 0usize;
    let mut lpad = 0f64;
    for (i, ch) in editor.text.chars().enumerate() {
        if ch == '\n' {
            row += 1;
            col = 0;
            last_head = i+1;
        } else {
            col += 1;
        }
        if editor.caret_position.row == row && editor.caret_position.col == col {
            lpad = context.measure_text(&editor.text[last_head..i+1])?.width();
            break;
        }
    }
    context.set_fill_style(&JsValue::from_str("rgba(25, 255, 25, 0.8)"));
    //let lpad = context.measure_text(&editor.text[0..(editor.caret_position.col as usize)])?.width();
    context.fill_rect(8.0+lpad, 8.0+20.0*row as f64, 2.0, 20.0);
    Ok(())
}

fn create_draggable(text: &str) -> Result<web_sys::HtmlElement, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let div = document.create_element("div").unwrap()
        .dyn_into::<web_sys::HtmlElement>()
        .map_err(|_| ())
        .unwrap();
    div.set_attribute("draggable", "true")?;
    div.set_attribute("data-key-btn", text)?;
    div.set_attribute("data-key-top", text)?;
    //div.set_inner_html(text);
    Ok(div)
}

fn create_key_container() -> Result<web_sys::HtmlElement, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let div = document.create_element("div").unwrap()
        .dyn_into::<web_sys::HtmlElement>()
        .map_err(|_| ())
        .unwrap();
    div.set_id("key_container");
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
    elem.class_list().add_1("key").unwrap();
}

use std::cell::RefMut;
fn swap_key(mut km: RefMut<HashMap<String, String>>, key1: &web_sys::HtmlElement, key2: &web_sys::HtmlElement) {
    let key1_top = key1.get_attribute("data-key-top").unwrap();
    let key2_top = key2.get_attribute("data-key-top").unwrap();
    let key1_btn = key1.get_attribute("data-key-btn").unwrap();
    let key2_btn = key2.get_attribute("data-key-btn").unwrap();
    console_log!("{}(key:{}) <=> {}(key:{})", key1_top, key1_btn, key2_top, key2_btn);
    key1.set_attribute("data-key-top", &key2_top).unwrap();
    key2.set_attribute("data-key-top", &key1_top).unwrap();
    km.insert(key1_btn, key2_top);
    km.insert(key2_btn, key1_top);
}

#[derive(Clone)]
struct CaretPosition {
    row: usize,
    col: usize,
    count: usize,
}

#[derive(Clone)]
struct Editor {
    text: String,
    caret_position: CaretPosition,
}

impl Editor {
    fn insert_str(&mut self, s: &str) {
        self.text.insert_str(self.caret_position.count, s);
        self.caret_position.col = self.caret_position.col.saturating_add(s.len());
        self.caret_position.count = self.caret_position.count.saturating_add(s.len());
    }
    fn newline(&mut self) {
        self.text.insert_str(self.caret_position.count, "\n");
        self.caret_position.col = 0;
        self.caret_position.row += 1;
        self.caret_position.count += 1;
    }
    fn backspace(&mut self) {
        if self.caret_position.col > 0 {
            self.text.replace_range(self.caret_position.col-1..self.caret_position.col, "");
            self.caret_position.col = self.caret_position.col.saturating_sub(1);
            self.caret_position.count = self.caret_position.count.saturating_sub(1);
        }
    }
    fn move_left(&mut self) {
        self.caret_position.col = self.caret_position.col.saturating_sub(1);
        self.caret_position.count = self.caret_position.count.saturating_sub(1);
    }
    fn move_right(&mut self) {
        self.caret_position.col = self.caret_position.col.saturating_add(1).min(self.text.len());
        self.caret_position.count = self.caret_position.count.saturating_add(1).min(self.text.len());
    }
}

#[wasm_bindgen]
pub fn greet(name: &str) -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let body = document.body().unwrap();
    let style = create_style("
        body {
            perspective: 1000px;
        }
        canvas {
	        transform: translateY(64px) translateZ(-142px) translateX(200px);
            border: 10px solid #505254;
            box-shadow: 0px 2px #333333 inset;
        }
        .key.drophover {
            background: #fafaff;
            box-shadow: 0 0 25px #e8e8e8 inset, 0 2px 0 #c3c3c3, 0 4px 0 #c9c9c9, 0 4px 6px #333333;
        }
        .key {
            display: inline-block;
            width: 24px;
            height: 41px;
            margin: 5px 6px;
            padding: 0 10px;
            border-top: 1px solid #808080;
            border-bottom: 1px solid #a5a5a5;
            border-radius: 4px;
            text-transform: capitalize;
            color: #aaaaaa;
            background: #454648;
            box-shadow: 0 0 25px #e8e8e822 inset, 0 2px 0 #404040, 0 4px 0 #4c4c4c, 0 2px 3px #333333;
            text-shadow: 0 1px 0 #F5F5F5;
            transition: background 0.3s;
        }
        .key:before {
            position: absolute;
            content: attr(data-key-top);
        }
        .push.key {
            border-top: 1px solid #333333;
            border-bottom: 1px solid #555555;
            box-shadow: 0 0 25px #e8e8e822 inset, 0 2px 0 transparent, 0 -2px 0 #333, 0 1px 0px #222222 inset;
        }
        .push.key:before {
            margin-top: 4px;
        }
        .key[data-key-btn=\"Backspace\"] {
            width: 80px;
            text-align: right;
        }
        .key[data-key-btn=\"Backspace\"]:before {
            transform: translateX(-100%);
        }
        .key[data-key-btn=\"Tab\"] {
            width: 56px;
        }
        .key[data-key-btn=\"\\\\\"] {
            width: 48px;
        }
        .key[data-key-btn=\"CapsLock\"] {
            width: 70px;
        }
        .key[data-key-btn=\"Enter\"] {
            width: 90px;
            text-align: right;
        }
        .key[data-key-btn=\"Enter\"]:before {
            transform: translateX(-100%);
        }
        .key[data-key-btn=\"Shift-L\"] {
            width: 100px;
        }
        .key[data-key-btn=\"Shift-R\"] {
            width: 116px;
            text-align: right;
        }
        .key[data-key-btn=\"Shift-R\"]:before {
            transform: translateX(-100%);
        }
        .key[data-key-btn=\"Ctrl-L\"] {
            width: 44px;
        }
        .key[data-key-btn=\" \"] {
            width: 248px;
        }







        #key_container {
	        transform: rotateX(45deg) translateX(200px);
            width: 840px;
            height: 400px;
            background: #505254;
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
        vec!["`","1","2","3","4","5","6","7","8","9","0","[","]","Backspace"],
        vec!["Tab", "'",",",".","p","y","f","g","c","r","l","/","=", "\\"],
        vec!["CapsLock","a","o","e","u","i","d","h","t","n","s","-", "Enter"],
        vec!["Shift-L",";","q","j","k","x","b","m","w","v","z","Shift-R"],
        vec!["Fn","Ctrl-L","🤔","Alt-L"," ","Alt-R","PrtSc","Ctrl-R"],
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
        caret_position: CaretPosition {count: 0, row: 0, col: 0}
        };
    update_canvas(&canvas, &editor).unwrap();

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
                target.class_list().add_1("drophover").unwrap();
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
                target.class_list().remove_1("drophover").unwrap();
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
                            target.class_list().remove_1("drophover").unwrap();
                        }
                    }
                    _ => {}
                };
            });
            draggable.add_event_listener_with_callback("drop", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
    }

    let kt = Rc::new(RefCell::new(keytops));
    let mut editor = Rc::new(editor);
    let canvas = Rc::new(canvas);
    let km1 = km.clone();
    let kt1 = kt.clone();
    {
        let closure = closure!(move |ev: web_sys::KeyboardEvent| {
            let key = ev.key();
            ev.prevent_default();
            match &*key {
                "Backspace" => {
                    make_mut!(editor).backspace();
                },
                "ArrowLeft" => {
                    make_mut!(editor).move_left();
                },
                "ArrowRight" => {
                    make_mut!(editor).move_right();
                },
                "Enter" => {
                    make_mut!(editor).newline();
                },
                _ => {
                    kt1.borrow().get(&ev.key()).map(|e| e.class_list().add_1("push").unwrap());
                    km1.borrow().get(&ev.key()).map_or_else(
                        || web_sys::console::log_1(&ev),
                        |k| {
                            ev.prevent_default();
                            make_mut!(editor).insert_str(k)
                            });
                }
            }
            update_canvas(&canvas, &editor).unwrap();
        });
        document.add_event_listener_with_callback("keydown", closure.as_ref().unchecked_ref())?;
        closure.forget();
    }
    let kt1 = kt.clone();
    {
        let closure = closure!(move |ev: web_sys::KeyboardEvent| {
            kt1.borrow().get(&ev.key()).map(|e| e.class_list().remove_1("push").unwrap());
        });
        document.add_event_listener_with_callback("keyup", closure.as_ref().unchecked_ref())?;
        closure.forget();
    }

    window.alert_with_message(&format!("Keyboard Simulator, {}!", name)).expect("could not alert");
    Ok(())
}
