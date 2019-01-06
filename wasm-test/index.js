const js =
    import ("./rustwasm_boilerplate");

js.then(js => {
    js.greet("World!");
});