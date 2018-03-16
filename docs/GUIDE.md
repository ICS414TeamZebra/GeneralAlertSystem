# GUIDE

**a guide on how this project was set up via commands from an empty directory. assumes npm was installed **

---

install express generator command:

```sh
npm install express-generator -g
```

generate empty app with handlebars and sass support:

```sh
express -v- hbs -c sass
```

install the dependencies:

```sh
npm install
```

to run:

```sh
SET DEBUG=generalalertsystem:* & npm start
```

install eslint

```sh
npm install eslint --save-dev
node ./node_modules/eslint/bin/eslint.js --init
```

configured as

```text
? How would you like to configure ESLint?
  Use a popular style guide
? Which style guide do you want to follow?
  Airbnb
? Do you use React?
  No
? What format do you want your config file to be in?
  JavaScript
```

database

```sh
npm install knex --save
npm install sqlite3 --save
```

testing

```
npm install mocha chai --save-dev
```

add some scripts to package.json

```json
...
"scripts" {
	...
	"test": "./node_modules/.bin/mocha **/**.spec.js",
	"lint": "./node_modules/.bin/eslint **/**.js"
}
...
```
