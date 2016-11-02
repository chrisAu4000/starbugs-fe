module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "standard-pure-fp",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "no-console": [
      "warn"
    ],
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-var": [
      "error"
    ],
    "rest-spread-spacing": [
      "error",
      "never"
    ],
    "arrow-spacing": [
      "error",
      { "before": true, "after": true }
    ],
    "prefer-spread": [
      "warn"
    ],
    "no-trailing-spaces": [
      "error"
    ]
  }
};
