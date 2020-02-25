For run example you need do next steps:

1. Set "examples" as current directory.
$ cd examples

2. Download dependencies for examples.
$ npm install

3. Build bundles items.
$ webpack --watch --progress --display-reasons
or with custom flag for display information about bundle process (show added and skipped files).
$ webpack --display-modules

4. Run dev server.
$ npm start
