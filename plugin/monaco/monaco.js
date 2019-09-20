// Function to perform a better "data-trim" on code snippets
// Will slice an indentation amount on each line of the snippet (amount based on the line having the lowest indentation length)
function betterTrim(code) {
    // Helper functions
    function trimLeft(val) {
        // Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
        return val.replace(/^[\s\uFEFF\xA0]+/g, '');
    }
    function trimLineBreaks(input) {
        var lines = input.split('\n');

        // Trim line-breaks from the beginning
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '') {
                lines.splice(i--, 1);
            } else break;
        }

        // Trim line-breaks from the end
        for (var i = lines.length-1; i >= 0; i--) {
            if (lines[i].trim() === '') {
                lines.splice(i, 1);
            } else break;
        }

        return lines.join('\n');
    }

    // Main function for betterTrim()
    var content = trimLineBreaks(code);
    var lines = content.split('\n');
    // Calculate the minimum amount to remove on each line start of the snippet (can be 0)
    var pad = lines.reduce(function(acc, line) {
        if (line.length > 0 && trimLeft(line).length > 0 && acc > line.length - trimLeft(line).length) {
            return line.length - trimLeft(line).length;
        }
        return acc;
    }, Number.POSITIVE_INFINITY);
    // Slice each line with this amount
    return lines.map(function(line, index) {
        return line.slice(pad);
    })
    .join('\n');
}

let MyPlugin = {
    init: () => {

        Array.prototype.slice.call(document.getElementsByTagName('editor')).forEach( block => {

            let additionalCode = '';

            Array.prototype.slice.call(block.getElementsByTagName('hidden')).forEach( hidden => {
                additionalCode += hidden.textContent;
                block.removeChild(hidden);
            });

            let code = block.textContent;
            console.log(code);
            // Trim whitespace if the "data-trim" attribute is present
            if( block.hasAttribute( 'data-trim' )) {
                code = betterTrim( code );
            }

            let args = 'code=' + btoa(code);

            if (additionalCode != '') {
                args += '&hidden=' + btoa(additionalCode);
            }
            if (block.hasAttribute('data-size')) {
                args += '&size=' + block.getAttribute('data-size');
            }
            if (block.hasAttribute('data-lang')) {
                args += '&lang=' + block.getAttribute('data-lang');
            }
            if (block.hasAttribute('data-tsconfig')) {
                args += '&conf=' + btoa(block.getAttribute('data-tsconfig'));
            }

            const frame = document.createElement('iframe');
            frame.setAttribute('data-src', './plugin/monaco/editor.html#' + args);
            frame.setAttribute('data-preload', true);
            if (block.hasAttribute('style')) {
                frame.setAttribute('style', block.getAttribute('style'));
            }
            if (block.hasAttribute('class')) {
                frame.setAttribute('class', block.getAttribute('class'));
            }
            frame.classList.add('editor');

            block.replaceWith(frame);
        });
    }
};
Reveal.registerPlugin( 'myPlugin', MyPlugin );
