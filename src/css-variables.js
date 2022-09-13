var postcss = require("postcss");
var cssvariables = require("postcss-css-variables");

var mycss = `
:root {
    --foo-width: 100px;
    --foo-bg-color: rgba(255, 0, 0, 0.85);
}
div {
    width: var(--foo-width);
}
`

// Process your CSS with postcss-css-variables
var output = postcss([cssvariables({
    preserve: true,
    variables: {
        '--test-kiki': '#ffffff'
    }
})]).process(mycss).css;

console.log(output);
