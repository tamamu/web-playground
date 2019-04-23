const mod =
    import ("./crate/pkg");

mod.then(mod => {
    mod.greet("World!");
});
