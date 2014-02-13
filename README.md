# Pacbot

Pacbot is a fast static site generator, built primarily for large single-page webapps.
While there are many static site generators, few are built to work with lots of files.
The main problem is in development mode, where many static site generators regenerate all files
when a single file changes. If you have a lot of files, this means waiting a few seconds
before you can see your changes in the browser. Pacbot has two distinct modes:

* **In dev mode**, all files are served on the fly, without regenerating the entire site.
* **In build mode**, all files are processed and all assets are packed into an uploadable dir.

Other features:

* HTML microtemplates
* Layouts and partials
* Asset packaging
* Deploy via rsync
* Staying out of your way

## Install

To install pacbot, use npm:

```
$ npm install pacbot -g
```

## Setup

Pacbot could be used in a directory with the following structure:

```
mysite/
    pacbot.js        -- the pacbot config file (more on this later)
    public/          -- the folder where the build-mode generated site is placed
    content/         -- the content for your site
        index.html   -- an index file for your site, along with any other file
        _partials/   -- a folder with all your partials
        _layouts/    -- a folder with all your layouts
```

* Pacbot will generate content from the `content` directory,
* The resulting site will be placed in the `public` directory.
* You can change the names of these folders from the command line, or in the `pacbot.js` file.
* Files or folders starting with `_` will not be processed into the `public` directory.
* Other than that, the names of the folders are not important in any way.


## Usage

Here is how to use Pacbot from the command line:

```
Usage: pacbot [options]

Options:

  -h, --help       output usage information
  -V, --version    output the version number

  -d, --dev        serve content directly from source folder
  -b, --build      build a complete version, with packed assets
  -s, --sync       sync target dir to remote server or local dir

  --port   <port>  change dev server port    (default 3000)
  --config <path>  change config file        (default ./pacbot.js)
  --source <path>  change source directory   (default ./content)
  --target <path>  change target directory   (default ./public)
  --remote <path>  set remote server address (no default)
```

Here are some common use cases:

```
# Development mode: serve files directly from ./content
$ pacbot -d

# Build mode: process all files and assets into ./public
$ pacbot -b

# Sync: rsync target directory to your remote server
$ pacbot -s --remote user@example.com:/path/to/document/root/

# Build and sync to different local folder
$ pacbot -b -s --remote relative/target/folder
```


## API

You may also use pacbot programmatically:

```js
var pacbot = require("pacbot");

// Set config flags
pacbot.init({
    source: "relative/source/folder/name",
    target: "relative/target/folder/name",
    remote: "foo@example.com:/path/to/document/root/"
});

// Start dev mode
pacbot.dev();

// Start build mode
pacbot.build();

// Sync target dir
pacbot.sync();
```


## Templates

Pacbot uses JS microtemplates from Underscore.js to parse HTML files.
For example, putting the following in your HTML file will output the current Unix timestamp:

```
<%= (new Date()).getTime() %>
```

You also have a few built-in helpers, most importantly `get(key)` and `set(key, value)` which can be used
to pass variables between files, partials and layouts. These variables are reset between each
individually generated page.


## Partials

Partials are small bits of HTML that you need on more than one page. Render another HTML file
(most often from your `_partials` directory) by using the `partial` helper:

```
<%= partial("_partials/myFile.html") %>
```

Putting your partials in a folder starting with `_` ensures that they will not be copied
into the `public` folder by themselves, but only as part of other files.


## Layouts

Layouts are used to surround your HTML files with standard content, like the doctype, your menu and footer.
Place your layout in `_layouts/default.html`, and it will be used automatically.
In your layout, you have the variable `content`, which denotes where the main content should be placed:

```
<!doctype html>
<html>
<head>
    <title>My Site</title>
</head>
<body>
    <%= content %>
</body>
</html>
```

You can use different layouts for different files. This is specified
in your `pacbot.js` file (explained at the end of this readme):

```js
exports.config = function() {
    return {
        layouts: {
            'mypage.html': '_layouts/other.html'
        }
    };
};
```

Create an object with your custom layouts, called `layouts`, where each key should be a
substring of the file path to match, and the value points to the layout file.


## Assets

Assets (for now, just JS and CSS files) are served as they are in dev mode, and concatenated and minified in build mode.
Which assets belong in which group is specified in the `pacbot.js` file (see the next section).
To include your assets, use the `assets` helper, quite possibly in your layout file:

```
<!doctype html>
<html>
<head>
    <title>My Site</title>
    <%= assets("css", "group1") %>
</head>
<body>
    <%= content %>
    <%= assets("js", "group2") %>
</body>
</html>
```


## Config

Pacbot will look for a `pacbot.js` file in the directory in which it is run.
You can override where to look for the config with the `-c` command line flag.
The config is a valid node.js module with one function that returns your config. 
Here is an example:

```js
exports.config = function(pacbot) {
    
    // Create a new config object.
    var config = {
        assets: {}
    };
        
    // Groups of css files (or folders).
    config.assets.css = {
        group1: ['css/1.css', 'css/2.css']
    };
    
    // Groups of js files (or folders).
    config.assets.js = {
        group2: ['js/a.js', 'js/b.js']
    };
    
    // Custom HTML helpers.
    config.helpers = {
        hello: function() {
            return 'hello!';
        }
    };
    
    // Custom filters for filetypes.
    pacbot.filter.set('target', 'html', function(path) {
        // Strip file extension from HTML files.
        return path.replace(/\.html$/, '');
    });
    
    // Return the config object.
    return config;

};
```

The main purpose of the file is to specify assets (in order), any default command line flags,
and any custom HTML helper functions.

In this example, we have two types of assets (CSS and JS), which each have one group of assets.
If the order is not important, you can use folder names instead of filenames,
and each file in that directory will be included.
Each asset file path is suffixed with a `?v=<current_build_timestamp>` for proper cache busting.
You can disable this with the `config.timestamp` flag.

We have a helper function (`hello`), usable in any HTML file.
The assets can be referenced in an HTML file like this:

```
<%= assets("css", "group1") %>
<%= assets("js", "group2") %>

<%= hello() %>
```

There are many other config flags you may override. 
See the file `lib/config.js` for all config flags.
See how you can write filters for different file types 
in the `filters/` folder.

## License

MIT. See LICENSE.
