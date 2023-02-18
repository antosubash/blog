module.exports = {
    description: "Create a new post",
    prompts: [
        {
            type: "input",
            name: "title",
            message: "What is your post title?",
        },
        {
            type: "input",
            name: "description",
            message: "What is your post description?",
        },
        {
            type: "input",
            name: "tags",
            message: "What are your post tags?",

        },
        {
            type: "input",
            name: "folder",
            message: "What is your post folder?",
        }
    ],
    actions: function (data) {
        const actions = [];
        actions.push({
            type: "add",
            path: "_posts/{{folder}}/{{kebabCase title}}.mdx",
            templateFile: "plop-templates/post.hbs",
        });
        return actions;
    },
};