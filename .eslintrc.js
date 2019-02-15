module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "rules": {
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "import/prefer-default-export": [0],
        "linebreak-style": [0],
        "react/prop-types": [0],
        "comma-dangle": [0],
        "implicit-arrow-linebreak": [0],
        "react/prefer-stateless-function": [0, { "ignorePureComponents": true }]
    }
};