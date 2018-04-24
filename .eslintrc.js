module.exports = {
  "extends": "airbnb-base",
  "rules": {
  	"consistent-return": 0,
    "no-restricted-syntax": 0,
    "max-len": 0,
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "node_modules",
          ".",
        ]
      }
    }
  },
};