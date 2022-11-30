module.exports = function generator(plop) {
    plop.setDefaultInclude({ generators: true, helpers: true });
    plop.setHelper("date", () => {
        const date = new Date().toISOString();
        return date
    })

    plop.setHelper("includes", (array, string, options) => {
        if (array.includes(string)) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    })
    plop.setGenerator("post", require("./plop-templates/post.js"));
};