ejs.compile('templateText') // new Template('templateText', opts)
```javascript
let opts = {
    _with:true,
    async:undefined,
    cache:false,
    client:false,
    closeDelimiter:'>',
    compileDebug:true,
    context:undefined,
    debug:false,
    delimiter:'%',
    destructuredLocals:undefined,
    escapeFunction: function() {...},
    filename:undefined,
    legacyInclude:true,
    localsName:'locals'
}
```
## 流程

> <- html >
ejs把templatetext，match匹配成字符串，[ …, html, …] , 在拼接prehend, append，再封装成new Function(‘locals’, ‘escapeFn’, functionBody)，返回该函数。
#### returnFn
```javascript
    function(data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    }
```


#### fn
```javascript
(function anonymous(locals, escapeFn, include, rethrow
) {
// locals: { assets: {main: 'index.js'}, html: '这里是webpack处理过后的html字符串,👇' }
var __line = 1
  , __lines = "<html>\n  <head>\n    <title>CSS Modules Webpack Demo</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\" />\n  </head>\n  <body>\n    <div id=\"outlet\">\n      <%- html %>\n    </div>\n  </body>\n</html>\n"
  , __filename = undefined;
try {
// —————这里拼接一部分———————
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<html>\n  <head>\n    <title>CSS Modules Webpack Demo</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\" />\n  </head>\n  <body>\n    <div id=\"outlet\">\n      ")
    ; __line = 9
    ; __append( html )
    ; __append("\n    </div>\n  </body>\n</html>\n")
    ; __line = 13
  }
  return __output;
// ———————————————
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

})
```


#### __output 字符串
```javascript
`<html>
  <head>
    <title>CSS Modules Webpack Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <div id="outlet">
      <!-- html字符串 start-->
      <div class="App__app___3lRY_"><div class="Logo__logo___3xrQQ"></div><h1>CSS Modules Webpack Demo</h1><hr class="App__hr___2U3ua"><h2>Scoped Selectors</h2><p>In CSS Modules, selectors are scoped by default.</p><p>The following component uses two classes, <strong>.root</strong> and <strong>.text</strong>, both of which would typically be too vague in a larger project.</p><p>CSS Module semantics ensure that these <strong>classes are locally scoped</strong> to the component and don&#x27;t collide with other classes in the global scope.</p><div class="Snippet__root___2B-wp"><div class="Snippet__output___sVK0p"><div class="Snippet__fileName___Tz7_C">Output</div><div class="Snippet__outputContent___2_vnF"><div class="ScopedSelectors__root___16yOh"><p class="ScopedSelectors__text___1hOhe">Scoped Selectors</p></div></div></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">ScopedSelectors.js</div><pre class="Snippet__pre___3b3O_">
import styles from &#x27;./ScopedSelectors.css&#x27;;

import React, { Component } from &#x27;react&#x27;;

export default class ScopedSelectors extends Component {

  render() {
    return (
      &lt;div className={ styles.root }&gt;
        &lt;p className={ styles.text }&gt;Scoped Selectors&lt;/p&gt;
      &lt;/div&gt;
    );
  }

};
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">ScopedSelectors.css</div><pre class="Snippet__pre___3b3O_">
.root {
  border-width: 2px;
  border-style: solid;
  border-color: #777;
  padding: 0 20px;
  margin: 0 6px;
  max-width: 400px;
}

.text {
  color: #777;
  font-size: 24px;
  font-family: helvetica, arial, sans-serif;
  font-weight: 600;
}
</pre></div></div><hr class="App__hr___2U3ua"><h2>Global Selectors</h2><p>Although they should be used as sparingly as possible, <strong>global selectors are still available when required.</strong></p><p>The following component styles all <strong>&lt;p&gt;</strong> tags nested inside it.</p><div class="Snippet__root___2B-wp"><div class="Snippet__output___sVK0p"><div class="Snippet__fileName___Tz7_C">Output</div><div class="Snippet__outputContent___2_vnF"><div class="GlobalSelectors__root___xFJPw"><p class="text">Global Selectors</p></div></div></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">GlobalSelectors.js</div><pre class="Snippet__pre___3b3O_">
import styles from &#x27;./GlobalSelectors.css&#x27;;

import React, { Component } from &#x27;react&#x27;;

export default class GlobalSelectors extends Component {

  render() {
    return (
      &lt;div className={ styles.root }&gt;
        &lt;p className=&quot;text&quot;&gt;Global Selectors&lt;/p&gt;
      &lt;/div&gt;
    );
  }

};
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">GlobalSelectors.css</div><pre class="Snippet__pre___3b3O_">
.root {
  border-width: 2px;
  border-style: solid;
  border-color: brown;
  padding: 0 20px;
  margin: 0 6px;
  max-width: 400px;
}

.root :global .text {
  color: brown;
  font-size: 24px;
  font-family: helvetica, arial, sans-serif;
  font-weight: 600;
}
</pre></div></div><hr class="App__hr___2U3ua"><h2>Class Composition</h2><p>Both of the components below have <strong>locally scoped CSS</strong> that is <strong>composed from a common set of CSS Modules.</strong></p><p>Since <strong>CSS Modules can be composed</strong>, the resulting markup is optimised by <b>reusing classes between components</b>.</p><div class="Snippet__root___2B-wp"><div class="Snippet__output___sVK0p"><div class="Snippet__fileName___Tz7_C">Output</div><div class="Snippet__outputContent___2_vnF"><div><div class="StyleVariantA__root___1gRpN layout__box___3mduB"><p class="StyleVariantA__text___qC0Qk typography__heading___xZ-BK">Style Variant A</p></div><br><div class="StyleVariantB__root___KlZE5 layout__box___3mduB"><p class="StyleVariantB__text___2RHD6 typography__heading___xZ-BK">Style Variant B</p></div></div></div></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">StyleVariantA.js</div><pre class="Snippet__pre___3b3O_">
import styles from &#x27;./StyleVariantA.css&#x27;;

import React, { Component } from &#x27;react&#x27;;

export default class StyleVariantA extends Component {

  render() {
    return (
      &lt;div className={styles.root}&gt;
        &lt;p className={styles.text}&gt;Style Variant A&lt;/p&gt;
      &lt;/div&gt;
    );
  }

};
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">StyleVariantA.css</div><pre class="Snippet__pre___3b3O_">
.root {
  composes: box from &quot;shared/styles/layout.css&quot;;
  border-color: red;
}

.text {
  composes: heading from &quot;shared/styles/typography.css&quot;;
  color: red;
}
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">shared/styles/layout.css</div><pre class="Snippet__pre___3b3O_">
.box {
  border-width: 2px;
  border-style: solid;
  padding: 0 20px;
  margin: 0 6px;
  max-width: 400px;
}
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">shared/styles/typography.css</div><pre class="Snippet__pre___3b3O_">
.heading {
  font-size: 24px;
  font-family: helvetica, arial, sans-serif;
  font-weight: 600;
}
</pre></div></div><hr class="App__hr___2U3ua"><h2>Composition Overrides</h2><p>When composing classes, <strong>inherited style properties can be overridden</strong> as you&#x27;d expect.</p><p>The following component composes two different classes, but provides overrides which then take precedence.</p><div class="Snippet__root___2B-wp"><div class="Snippet__output___sVK0p"><div class="Snippet__fileName___Tz7_C">Output</div><div class="Snippet__outputContent___2_vnF"><div class="CompositionOverrides__root___2xnGH layout__box___3mduB"><p class="CompositionOverrides__text___3eIkk typography__heading___xZ-BK">Class Composition with Overrides</p></div></div></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">CompositionOverrides.js</div><pre class="Snippet__pre___3b3O_">
import styles from &#x27;./CompositionOverrides.css&#x27;;

import React, { Component } from &#x27;react&#x27;;

export default class CompositionOverrides extends Component {

  render() {
    return (
      &lt;div className={styles.root}&gt;
        &lt;p className={styles.text}&gt;Class Composition with Overrides&lt;/p&gt;
      &lt;/div&gt;
    );
  }

};
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">CompositionOverrides.css</div><pre class="Snippet__pre___3b3O_">
.root {
  composes: box from &quot;shared/styles/layout.css&quot;;
  border-style: dotted;
  border-color: green;
}

.text {
  composes: heading from &quot;shared/styles/typography.css&quot;;
  font-weight: 200;
  color: green;
}
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">shared/styles/layout.css</div><pre class="Snippet__pre___3b3O_">
.box {
  border-width: 2px;
  border-style: solid;
  padding: 0 20px;
  margin: 0 6px;
  max-width: 400px;
}
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">shared/styles/typography.css</div><pre class="Snippet__pre___3b3O_">
.heading {
  font-size: 24px;
  font-family: helvetica, arial, sans-serif;
  font-weight: 600;
}
</pre></div></div><hr class="App__hr___2U3ua"><h2>Scoped Animations</h2><p>CSS Modules even provide <strong>locally scoped animations</strong>, which are typically defined in the global scope.</p><p>The animation&#x27;s keyframes are private to the animations module, only exposed publicly via a class which this component inherits from.</p><div class="Snippet__root___2B-wp"><div class="Snippet__output___sVK0p"><div class="Snippet__fileName___Tz7_C">Output</div><div class="Snippet__outputContent___2_vnF"><div class="ScopedAnimations__root___31A0H"><div class="ScopedAnimations__ball___1jrfA animations__bounce___1So7p"></div></div></div></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">ScopedAnimations.js</div><pre class="Snippet__pre___3b3O_">
import styles from &#x27;./ScopedAnimations.css&#x27;;

import React, { Component } from &#x27;react&#x27;;

export default class ScopedAnimations extends Component {

  render() {
    return (
      &lt;div className={styles.root}&gt;
        &lt;div className={styles.ball} /&gt;
      &lt;/div&gt;
    );
  }

};
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">ScopedAnimations.css</div><pre class="Snippet__pre___3b3O_">
.root {
  padding: 20px 10px;
}

.ball {
  composes: bounce from &quot;shared/styles/animations.css&quot;;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: rebeccapurple;
}
</pre></div><div class="Snippet__file___12x_l"><div class="Snippet__fileName___Tz7_C">shared/styles/animations.css</div><pre class="Snippet__pre___3b3O_">
@keyframes bounce {
  33% { transform: translateY(-20px); }
  66% { transform: translateY(0px); }
}

.bounce {
  animation: bounce 1s infinite ease-in-out;
}
</pre>
<!-- html字符串 end-->
</div></div></div>
    </div>
  </body>
</html>
`
```

## 如何解析的templateText字符串的呢?
- 用正则匹配出 符合api约定的 字符串位置
- 再对str进行切割，递归处理剩余的str
```javascript
Template.prototype.parseTemplateText = function () {
    var str = `<html>
        <head>
            <title>CSS Modules Webpack Demo</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" type="text/css" href="style.css" />
            <meta  name=<%- metaname %> />
        </head>
        <body>
            <div id="outlet">
            <%- html %>
                
            </div>
        </body>
        </html>
    `;
    var pat = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/
    // result: [
    //     "<%-", 
    //     "<%-", 
    //     index: 214, 
    //     input: "<html>\n  <head>\n    <title>CSS Modules Webpack Dem…%- html %>\n        \n    </div>\n  </body>\n</html>\n", // 传入的str
    //     groups: undefined
    // ]
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  }
parseTemplateText()
// return:
// [
//     "<html>\n  <head>\n    <title>CSS Modules Webpack Dem…e=\"text/css\" href=\"style.css\" />\n    <meta  name=", 
//     "<%-",
//     " metaname ", 
//     "%>", 
//     " />\n  </head>\n  <body>\n    <div id=\"outlet\">\n      ",
//     "<%-", 
//     " html ", 
//     "%>", 
//     "\n        \n    </div>\n  </body>\n</html>\n"
// ]
```