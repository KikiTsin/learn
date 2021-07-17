- parse流程
    - 最上层：AST_Toplevel
    - tokenizer
    - next_token获取下一个token，根据PUNC_CHARS(标点符号 , ; : ( )) NON_IDENTIFIER_CHARS (/ . ' " #等) KEYWORDS(break case catch class const continue debugger default等) 来判断是哪种数据类型，最终形成的AST_Token，如图所示：主要是{type:'keyword', value: 'return', pos: 30, thedef: undefined}, 混淆之后，会赋值thedef: {..., mangled_name: 'b', name: 'b'}； 如果是二元表达式a+b则是AST_Binary类型，{end: , start: , left: , right: }

- 生成code  output.js  ast.js（每种asttype对应的print方法不同）
  1. 生成一个stream对象，包含indent space to_utf8 with_block push_node等方法
  2. OUTPUT= ''，在遍历AST的过程中，除了拼接name mangled_name外，调用space等方法 去掉原有的多余空格
  3. 从topLevel 到body 向下遍历，入栈出栈，print 拼接出OUTPUT
```javascript
    // parse主代码
    function parse () {
        return function () {
            // ... 已经声明过S S.input = next_token 获取过S.token = next()
            return function() {
              var start = S.token;
              var body = [];
              S.input.push_directives_stack();
              while (!is("eof"))
                  body.push(statement());
              S.input.pop_directives_stack();
              var end = prev() || start;
              var toplevel = options.toplevel;
              if (toplevel) {
                  toplevel.body = toplevel.body.concat(body);
                  toplevel.end = end;
              } else {
                  toplevel = new AST_Toplevel({ start: start, body: body, end: end });
              }
              return toplevel;
          }();
        }
    }
    function next () {
        // ...
        S.token = S.input() // 调用 next_token
        // ...
    }
    function next_token() {
        if (force_regexp != null)
            return read_regexp(force_regexp);
        if (shebang && S.pos == 0 && looking_at("#!")) {
            start_token();
            forward(2);
            skip_line_comment("comment5");
        }
        for (;;) {
            skip_whitespace();
            start_token();
            // ...省略处理html5comments
            var ch = peek();
            if (!ch) return token("eof");
            var code = ch.charCodeAt(0);
            switch (code) {
              case 34: case 39: return read_string(ch);
              case 46: return handle_dot();
              case 47:
                var tok = handle_slash();
                if (tok === next_token) continue;
                return tok;
            }
            if (is_digit(code)) return read_num();
            if (PUNC_CHARS[ch]) return token("punc", next());
            if (looking_at("=>")) return token("punc", next() + next());
            if (OPERATOR_CHARS[ch]) return read_operator();
            if (code == 35 || code == 92 || !NON_IDENTIFIER_CHARS[ch]) return read_word();
            break;
        }
    }

    AST_Node.DEFMETHOD("print", function(stream, force_parens) {
        var self = this;
        stream.push_node(self);
        if (force_parens || self.needs_parens(stream)) {
            stream.with_parens(doit);
        } else {
            doit();
        }
        stream.pop_node();

        function doit() {
            stream.prepend_comments(self);
            self.add_source_map(stream);
            self._codegen(stream);
            stream.append_comments(self);
        }
    });
```
