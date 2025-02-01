import { parse } from 'acorn';
import * as walk from 'acorn-walk';

import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const transformToBookmarklet = () => {
  return {
    name: 'transform-to-bookmarklet',
    renderChunk(code) {
      // Encode any % characters in the code to avoid syntax errors in the bookmarklet.
      code = code.replace(/%/g, '%25');

      return {
        code: `javascript:${code}`,
        map: null
      };
    }
  };
};

// Custom Rollup plugin to minify CSS in string literals tagged with CSS``.
const minifyCSSInStringLiterals = () => {
  return {
    name: 'minify-css-in-string-literals',
    transform(code, id) {
      let hasChanges = false;
      const ast = parse(code, { 
        sourceType: 'module', 
        ecmaVersion: 'latest', 
        plugins: { typescript: true } 
      });
      
      let result = code;
      
      walk.simple(ast, {
        TaggedTemplateExpression(node) {
          if (node.tag.type === 'Identifier' && node.tag.name === 'CSS') {
            hasChanges = true;
            const template = node.quasi;
            
            const minifiedCSS = template.quasis
              .map(quasi => quasi.value.raw
                .replace(/\s+/g, ' ')
                .replace(/[\n\r]/g, '')
                .trim()
              )
              .join('');
            
            result = result.slice(0, node.start) + 
                    '`' + minifiedCSS + '`' + 
                    result.slice(node.end);
          }
        }
      });
      
      return hasChanges ? { code: result } : null;
    }
  };
};

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bookmarklet.js',
    name: 'Bookmarklet',
    format: 'iife',
    plugins: [transformToBookmarklet()]
  },
  plugins: [minifyCSSInStringLiterals(), typescript(), terser()]
};