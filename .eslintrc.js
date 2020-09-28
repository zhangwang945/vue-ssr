module.exports = {
    parser: "vue-eslint-parser",
    root: true,
    parserOptions: {
        // ecmaVersion: 2020,
        parser: "babel-eslint",
        allowImportExportEverywhere: true,
        sourceType: "module",
    },
    env: {
        browser: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:vue/essential"],
    rules: {
        "no-debugger": 1,
        "no-unused-vars": 1,
        "no-restricted-imports": 0
    }

}