/**
 * Syntax colors: TextMate scopes and semantic tokens -> the JetBrains editor attributes that color the same code.
 * Hand kept: change it and run `bun run sync:colors`.
 *
 * Each rule lists attribute keys: the first one the color scheme defines gives the font style, the first one with a
 * foreground gives the color (like the IDE, which draws a key without a color in the color of the layer under it). Many
 * language keys of the IDE fall back to a default key in code, not in the scheme files (`JSON.PROPERTY_KEY` ->
 * `DEFAULT_INSTANCE_FIELD`, `YAML_SCALAR_KEY` -> `DEFAULT_KEYWORD`): those fallbacks are written here.
 * The order of the rules is kept in the theme: for the same scope depth, a later rule wins in VS Code.
 */
/** Semantic keys of the JavaScript plugin (its fallbacks are not in this repository: the default ones are written) */
const JS_MEMBER_FUNCTION = ['JS.INSTANCE_MEMBER_FUNCTION', 'DEFAULT_INSTANCE_METHOD', 'DEFAULT_FUNCTION_CALL', 'TEXT'];
const JS_GLOBAL_VARIABLE = ['JS.GLOBAL_VARIABLE', 'DEFAULT_GLOBAL_VARIABLE'];

export type TokenRule = { from: string[]; name: string; scope: string[] };

export const TOKEN_RULES: TokenRule[] = [
  // Defaults of every language
  { from: ['DEFAULT_LINE_COMMENT'], name: 'Comment', scope: ['comment', 'punctuation.definition.comment'] },
  { from: ['DEFAULT_BLOCK_COMMENT'], name: 'Block comment', scope: ['comment.block'] },
  {
    from: ['DEFAULT_DOC_COMMENT'],
    name: 'Doc comment',
    scope: ['comment.block.documentation', 'comment.block.javadoc', 'string.quoted.docstring'],
  },
  { from: ['DEFAULT_DOC_COMMENT_TAG'], name: 'Doc comment tag', scope: ['comment.block.documentation storage.type', 'comment.block.documentation keyword', 'storage.type.class.jsdoc'] },
  { from: ['DEFAULT_KEYWORD'], name: 'Keyword', scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control', 'constant.language', 'variable.language.this', 'variable.language.super'] },
  { from: ['DEFAULT_OPERATION_SIGN', 'TEXT'], name: 'Operator', scope: ['keyword.operator', 'punctuation.separator.key-value', 'punctuation.accessor'] },
  // Word operators are keywords in the IDE (and, or, not, in, is, new, typeof…)
  { from: ['DEFAULT_KEYWORD'], name: 'Word operator', scope: ['keyword.operator.logical.python', 'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.word', 'keyword.operator.instanceof', 'keyword.operator.typeof'] },
  { from: ['DEFAULT_STRING'], name: 'String', scope: ['string', 'punctuation.definition.string'] },
  { from: ['DEFAULT_VALID_STRING_ESCAPE'], name: 'String escape', scope: ['constant.character.escape', 'constant.character.format.placeholder', 'meta.format.percent', 'constant.other.placeholder'] },
  { from: ['DEFAULT_INVALID_STRING_ESCAPE'], name: 'Invalid string escape', scope: ['invalid.illegal.character.escape', 'invalid.illegal.unrecognized-string-escape'] },
  { from: ['DEFAULT_NUMBER'], name: 'Number', scope: ['constant.numeric'] },
  { from: ['DEFAULT_CONSTANT'], name: 'Constant', scope: ['variable.other.constant', 'constant.other', 'variable.other.enummember', 'entity.name.constant'] },
  { from: ['DEFAULT_FUNCTION_DECLARATION'], name: 'Function declaration', scope: ['entity.name.function', 'meta.definition.method entity.name.function', 'meta.function entity.name.function'] },
  { from: ['DEFAULT_FUNCTION_CALL', 'TEXT'], name: 'Function call', scope: ['meta.function-call entity.name.function', 'meta.function-call.generic', 'support.function'] },
  { from: ['DEFAULT_INSTANCE_METHOD', 'DEFAULT_FUNCTION_CALL', 'TEXT'], name: 'Method call', scope: ['meta.method-call entity.name.function', 'meta.function-call.method'] },
  { from: ['DEFAULT_INSTANCE_FIELD'], name: 'Field', scope: ['variable.other.property', 'variable.other.object.property', 'variable.other.member', 'support.variable.property', 'entity.name.variable.field'] },
  { from: ['DEFAULT_CLASS_NAME', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'Class name', scope: ['entity.name.type', 'entity.name.class', 'entity.other.inherited-class'] },
  { from: ['DEFAULT_CLASS_REFERENCE', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'Class reference', scope: ['support.class', 'support.type', 'entity.name.type.module'] },
  { from: ['DEFAULT_INTERFACE_NAME', 'DEFAULT_CLASS_NAME', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'Interface name', scope: ['entity.name.type.interface'] },
  { from: ['TYPE_PARAMETER_NAME_ATTRIBUTES'], name: 'Type parameter', scope: ['entity.name.type.parameter', 'meta.type.parameters entity.name.type'] },
  { from: ['DEFAULT_PARAMETER', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'Parameter', scope: ['variable.parameter'] },
  { from: ['DEFAULT_METADATA'], name: 'Annotation', scope: ['meta.decorator', 'entity.name.function.decorator', 'punctuation.definition.decorator', 'storage.type.annotation', 'meta.annotation'] },
  { from: ['DEFAULT_LABEL', 'DEFAULT_IDENTIFIER'], name: 'Label', scope: ['entity.name.label'] },
  // The tag key colors the whole tag, its brackets too (XmlHighlighterColors: HTML_TAG -> DEFAULT_TAG)
  { from: ['HTML_TAG', 'DEFAULT_TAG', 'TEXT'], name: 'Tag punctuation', scope: ['punctuation.definition.tag', 'meta.tag punctuation'] },
  { from: ['HTML_TAG_NAME', 'XML_TAG_NAME', 'DEFAULT_KEYWORD'], name: 'Tag name', scope: ['entity.name.tag'] },
  { from: ['HTML_ATTRIBUTE_NAME', 'XML_ATTRIBUTE_NAME', 'DEFAULT_INSTANCE_FIELD'], name: 'Attribute name', scope: ['entity.other.attribute-name'] },
  { from: ['HTML_ATTRIBUTE_VALUE', 'XML_ATTRIBUTE_VALUE', 'DEFAULT_STRING'], name: 'Attribute value', scope: ['meta.attribute-with-value string', 'meta.tag string'] },
  { from: ['HTML_ENTITY_REFERENCE', 'XML_ENTITY_REFERENCE', 'DEFAULT_VALID_STRING_ESCAPE'], name: 'Entity', scope: ['constant.character.entity'] },
  { from: ['ERRORS_ATTRIBUTES'], name: 'Invalid', scope: ['invalid', 'invalid.illegal'] },
  { from: ['DEPRECATED_ATTRIBUTES'], name: 'Deprecated', scope: ['invalid.deprecated'] },

  // Python, as PyCharm colors it (keys and fallbacks of PyHighlighter.java: no key for constants or attributes, method
  // calls fall back to function calls)
  { from: ['PY.ANNOTATION', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'Python name in capitals', scope: ['constant.other.caps.python', 'variable.other.constant.python'] },
  { from: ['PY.METHOD_CALL', 'PY.FUNCTION_CALL', 'DEFAULT_FUNCTION_CALL', 'TEXT'], name: 'Python call', scope: ['meta.function-call.python entity.name.function', 'meta.function-call.generic.python'] },
  { from: ['PY.KEYWORD', 'DEFAULT_KEYWORD'], name: 'Python keyword', scope: ['keyword.control.flow.python', 'keyword.control.import.python', 'storage.type.function.python', 'storage.type.class.python', 'constant.language.python'] },
  { from: ['PY.SELF_PARAMETER', 'DEFAULT_KEYWORD'], name: 'Python self', scope: ['variable.parameter.function.language.special.self.python', 'variable.language.special.self.python', 'variable.parameter.function.language.special.cls.python', 'variable.language.special.cls.python'] },
  { from: ['PY.KEYWORD_ARGUMENT', 'DEFAULT_PARAMETER'], name: 'Python keyword argument', scope: ['variable.parameter.function-call.python', 'meta.function-call.arguments.python variable.parameter'] },
  { from: ['PY.BUILTIN_NAME', 'DEFAULT_PREDEFINED_SYMBOL'], name: 'Python builtin', scope: ['support.function.builtin.python', 'support.type.python', 'support.type.exception.python', 'support.function.builtin', 'support.type.builtin.python'] },
  { from: ['PY.PREDEFINED_USAGE', 'DEFAULT_PREDEFINED_SYMBOL'], name: 'Python special name', scope: ['support.variable.magic.python', 'support.function.magic.python', 'entity.name.function.magic.python'] },
  { from: ['PY.PREDEFINED_DEFINITION', 'PY.PREDEFINED_USAGE'], name: 'Python special method', scope: ['meta.function.python support.function.magic.python'] },
  { from: ['PY.DECORATOR', 'DEFAULT_METADATA'], name: 'Python decorator', scope: ['meta.function.decorator.python', 'entity.name.function.decorator.python', 'punctuation.definition.decorator.python'] },
  { from: ['PY.DOC_COMMENT', 'DEFAULT_DOC_COMMENT'], name: 'Python docstring', scope: ['string.quoted.docstring.multi.python', 'string.quoted.docstring.single.python'] },
  { from: ['PY.STRING.B', 'DEFAULT_STRING'], name: 'Python bytes', scope: ['string.quoted.binary.single.python', 'string.quoted.binary.multi.python'] },
  { from: ['PY.FUNC_DEFINITION', 'DEFAULT_FUNCTION_DECLARATION'], name: 'Python function', scope: ['meta.function.python entity.name.function.python'] },
  { from: ['PY.CLASS_DEFINITION', 'DEFAULT_CLASS_NAME', 'TEXT'], name: 'Python class', scope: ['entity.name.type.class.python'] },

  // Data and markup
  { from: ['JSON.PROPERTY_KEY', 'DEFAULT_INSTANCE_FIELD'], name: 'JSON key', scope: ['support.type.property-name.json', 'meta.object-literal.key', 'support.type.property-name.toml', 'support.type.property-name.table.toml'] },
  { from: ['YAML_SCALAR_KEY', 'DEFAULT_KEYWORD'], name: 'YAML key', scope: ['entity.name.tag.yaml'] },
  { from: ['YAML_ANCHOR', 'DEFAULT_IDENTIFIER'], name: 'YAML anchor', scope: ['entity.name.type.anchor.yaml', 'variable.other.alias.yaml', 'punctuation.definition.anchor.yaml', 'punctuation.definition.alias.yaml'] },
  { from: ['PROPERTIES.KEY', 'DEFAULT_KEYWORD'], name: 'Properties key', scope: ['support.type.property-name.properties', 'keyword.other.definition.ini', 'entity.name.section.group-title.ini'] },
  { from: ['PROPERTIES.KEY_VALUE_SEPARATOR', 'DEFAULT_OPERATION_SIGN', 'TEXT'], name: 'Properties separator', scope: ['punctuation.separator.key-value.ini'] },
  { from: ['CSS.PROPERTY_NAME', 'DEFAULT_INSTANCE_FIELD'], name: 'CSS property', scope: ['support.type.property-name.css', 'support.type.vendored.property-name.css', 'support.type.property-name.scss', 'support.type.property-name.less'] },
  { from: ['CSS.PROPERTY_VALUE', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'CSS value', scope: ['support.constant.property-value.css', 'meta.property-value.css'] },
  { from: ['CSS.TAG_NAME', 'DEFAULT_KEYWORD'], name: 'CSS selector', scope: ['entity.name.tag.css', 'entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css'] },
  { from: ['CSS.COLOR', 'DEFAULT_NUMBER'], name: 'CSS color', scope: ['constant.other.color.rgb-value.hex.css', 'support.constant.color'] },
  { from: ['CSS.URL', 'DEFAULT_STRING'], name: 'CSS url', scope: ['variable.parameter.url.css'] },
  { from: ['CSS.IMPORTANT', 'DEFAULT_KEYWORD'], name: 'CSS important', scope: ['keyword.other.important.css'] },
  { from: ['MARKDOWN_HEADER', 'DEFAULT_KEYWORD'], name: 'Markdown header', scope: ['markup.heading', 'entity.name.section.markdown', 'punctuation.definition.heading.markdown'] },
  { from: ['MARKDOWN_BOLD'], name: 'Markdown bold', scope: ['markup.bold'] },
  { from: ['MARKDOWN_ITALIC'], name: 'Markdown italic', scope: ['markup.italic'] },
  { from: ['MARKDOWN_CODE_SPAN', 'DEFAULT_STRING'], name: 'Markdown code span', scope: ['markup.inline.raw', 'markup.inline.raw.string.markdown'] },
  { from: ['MARKDOWN_CODE_FENCE', 'MARKDOWN_CODE_BLOCK', 'DEFAULT_STRING'], name: 'Markdown code fence', scope: ['markup.fenced_code.block.markdown punctuation.definition.markdown', 'fenced_code.block.language'] },
  { from: ['MARKDOWN_CODE_BLOCK', 'DEFAULT_STRING'], name: 'Markdown code block', scope: ['markup.raw.block.markdown'] },
  { from: ['MARKDOWN_BLOCK_QUOTE', 'MARKDOWN_TEXT', 'TEXT'], name: 'Markdown quote', scope: ['markup.quote'] },
  { from: ['MARKDOWN_BLOCK_QUOTE_MARKER', 'DEFAULT_KEYWORD'], name: 'Markdown quote marker', scope: ['punctuation.definition.quote.begin.markdown'] },
  { from: ['MARKDOWN_LIST_MARKER', 'DEFAULT_KEYWORD'], name: 'Markdown list marker', scope: ['punctuation.definition.list.begin.markdown', 'beginning.punctuation.definition.list.markdown'] },
  { from: ['MARKDOWN_LINK_TEXT', 'HYPERLINK_ATTRIBUTES'], name: 'Markdown link text', scope: ['string.other.link.title.markdown', 'string.other.link.description.markdown'] },
  { from: ['MARKDOWN_LINK_DESTINATION', 'MARKDOWN_AUTO_LINK', 'HYPERLINK_ATTRIBUTES'], name: 'Markdown link', scope: ['markup.underline.link', 'markup.underline.link.markdown'] },
  { from: ['DEFAULT_KEYWORD'], name: 'Markdown separator', scope: ['meta.separator.markdown'] },
  { from: ['DIFF_INSERTED', 'CONSOLE_GREEN_OUTPUT'], name: 'Inserted', scope: ['markup.inserted'] },
  { from: ['DIFF_DELETED', 'CONSOLE_RED_OUTPUT'], name: 'Deleted', scope: ['markup.deleted'] },
  { from: ['DIFF_MODIFIED', 'CONSOLE_BLUE_OUTPUT'], name: 'Changed', scope: ['markup.changed'] },

  // XML (XmlHighlighterColors.java) and the custom elements of HTML
  { from: ['XML_TAG', 'DEFAULT_TAG', 'TEXT'], name: 'XML tag', scope: ['punctuation.definition.tag.xml'] },
  { from: ['XML_TAG_NAME', 'DEFAULT_KEYWORD'], name: 'XML tag name', scope: ['entity.name.tag.xml', 'entity.name.tag.localname.xml'] },
  { from: ['XML_ATTRIBUTE_NAME', 'DEFAULT_ATTRIBUTE', 'DEFAULT_INSTANCE_FIELD'], name: 'XML attribute name', scope: ['entity.other.attribute-name.xml', 'entity.other.attribute-name.localname.xml'] },
  { from: ['XML_NS_PREFIX', 'DEFAULT_INSTANCE_FIELD'], name: 'XML namespace prefix', scope: ['entity.name.tag.namespace.xml', 'entity.other.attribute-name.namespace.xml'] },
  { from: ['XML_PROLOGUE', 'TEXT'], name: 'XML prologue', scope: ['meta.tag.preprocessor.xml punctuation.definition.tag.xml', 'meta.tag.preprocessor.xml entity.name.tag.xml'] },
  { from: ['HTML_CUSTOM_TAG_NAME', 'HTML_TAG_NAME', 'DEFAULT_KEYWORD'], name: 'HTML custom element', scope: ['meta.tag.custom entity.name.tag'] },

  // Regular expressions (keys and fallbacks of RegExpHighlighter.java), for the regex scopes of the TypeScript,
  // JavaScript and Python grammars. Plain characters are strings; brackets and parentheses have the brace color.
  { from: ['REGEXP.CHARACTER', 'DEFAULT_STRING'], name: 'Regex', scope: ['string.regexp', 'constant.other.character-class.set.regexp', 'constant.other.character-class.range.regexp', 'constant.other.set.regexp', 'constant.character.set.regexp'] },
  { from: ['REGEXP.CHAR_CLASS', 'DEFAULT_ENTITY'], name: 'Regex class', scope: ['constant.other.character-class.regexp', 'support.other.escape.special.regexp'] },
  { from: ['REGEXP.DOT', 'DEFAULT_DOT', 'TEXT'], name: 'Regex dot', scope: ['support.other.match.any.regexp'] },
  { from: ['REGEXP.ESC_CHARACTER', 'DEFAULT_VALID_STRING_ESCAPE'], name: 'Regex escape', scope: ['constant.character.escape.backslash.regexp', 'constant.character.escape.regexp', 'constant.character.control.regexp', 'constant.character.numeric.regexp', 'constant.character.unicode.regexp', 'keyword.other.back-reference.regexp', 'entity.name.tag.backreference.regexp', 'entity.name.tag.named.backreference.regexp'] },
  { from: ['REGEXP.META', 'DEFAULT_KEYWORD'], name: 'Regex meta', scope: ['keyword.operator.quantifier.regexp', 'keyword.control.anchor.regexp', 'keyword.operator.or.regexp', 'keyword.operator.disjunction.regexp', 'keyword.operator.negation.regexp', 'support.other.match.begin.regexp', 'support.other.match.end.regexp'] },
  { from: ['REGEXP.BRACKETS', 'DEFAULT_BRACKETS', 'TEXT'], name: 'Regex brackets', scope: ['punctuation.definition.character-class.regexp', 'punctuation.character.set.begin.regexp', 'punctuation.character.set.end.regexp'] },
  {
    from: ['REGEXP.PARENTHS', 'DEFAULT_PARENTHS', 'TEXT'],
    name: 'Regex parentheses',
    // the IDE reads "(?=", "(?<!", "(?P<" as one parenthesis token
    scope: ['punctuation.definition.group.regexp', 'punctuation.definition.group.assertion.regexp', 'punctuation.definition.group.no-capture.regexp', 'support.other.parenthesis.regexp', 'string.regexp punctuation.parenthesis', 'string.regexp keyword.operator.lookahead', 'string.regexp keyword.operator.lookbehind', 'string.regexp keyword.operator.conditional'],
  },
  { from: ['REGEXP.NAME', 'DEFAULT_IDENTIFIER', 'TEXT'], name: 'Regex group name', scope: ['entity.name.tag.named.group.regexp'] },
  { from: ['REGEXP.OPTIONS', 'DEFAULT_PREDEFINED_SYMBOL'], name: 'Regex flags', scope: ['storage.modifier.flag.regexp'] },

  // JavaScript and TypeScript: a regex literal has the JS.REGEXP color (the scheme only has it, JS.REGEXP is not in
  // this repository: its fallback is the one the theme had before)
  {
    from: ['JS.REGEXP', 'DEFAULT_VALID_STRING_ESCAPE'],
    name: 'JavaScript regex',
    scope: ['string.regexp.ts', 'string.regexp.tsx', 'string.regexp.js', ...['ts', 'tsx', 'js'].flatMap((suffix) => [`string.regexp.${suffix} constant.other.character-class.set.regexp`, `string.regexp.${suffix} constant.other.character-class.range.regexp`])],
  },

  // Shell
  { from: ['BASH.EXTERNAL_COMMAND', 'DEFAULT_FUNCTION_CALL', 'TEXT'], name: 'Shell command', scope: ['support.function.builtin.shell', 'entity.name.command.shell'] },
  { from: ['BASH.VAR_USE', 'DEFAULT_INSTANCE_FIELD'], name: 'Shell variable', scope: ['variable.other.normal.shell', 'variable.other.positional.shell', 'variable.other.special.shell', 'punctuation.definition.variable.shell'] },
];

/**
 * VS Code semantic tokens (language servers: Pylance, TypeScript…), `type.modifier` selectors. The colors of the IDE
 * come from its own analysis, which they replace for the code a language server knows.
 */
// Not `variable.readonly`: TypeScript gives it to every `const`, which the IDE does not color as a constant
export const SEMANTIC_RULES: Record<string, string[]> = {
  '*.deprecated': ['DEPRECATED_ATTRIBUTES'],
  class: ['DEFAULT_CLASS_NAME', 'DEFAULT_CLASS_REFERENCE', 'TEXT'],
  'class.builtin': ['PY.BUILTIN_NAME', 'DEFAULT_PREDEFINED_SYMBOL', 'DEFAULT_CLASS_REFERENCE', 'TEXT'],
  clsParameter: ['PY.SELF_PARAMETER', 'DEFAULT_KEYWORD'],
  decorator: ['PY.DECORATOR', 'DEFAULT_METADATA'],
  enumMember: ['DEFAULT_CONSTANT'],
  function: ['DEFAULT_FUNCTION_CALL', 'TEXT'],
  'function.builtin': ['PY.BUILTIN_NAME', 'DEFAULT_PREDEFINED_SYMBOL', 'DEFAULT_FUNCTION_CALL', 'TEXT'],
  'function.declaration': ['DEFAULT_FUNCTION_DECLARATION'],
  interface: ['DEFAULT_INTERFACE_NAME', 'DEFAULT_CLASS_NAME', 'TEXT'],
  macro: ['DEFAULT_METADATA'],
  method: ['DEFAULT_INSTANCE_METHOD', 'DEFAULT_FUNCTION_CALL', 'TEXT'],
  'method.declaration': ['DEFAULT_FUNCTION_DECLARATION'],
  'method.declaration:python': ['PY.FUNC_DEFINITION', 'DEFAULT_FUNCTION_DECLARATION'],
  'method.static': ['DEFAULT_STATIC_METHOD', 'DEFAULT_INSTANCE_METHOD', 'TEXT'],
  // JavaScript and TypeScript (keys of the JavaScript plugin that the Islands scheme colors): members, and the globals
  // of the standard and DOM libraries (console, window, Math…), which the language server marks `defaultLibrary`
  'method:javascript': JS_MEMBER_FUNCTION,
  'method:javascriptreact': JS_MEMBER_FUNCTION,
  'method:python': ['PY.METHOD_CALL', 'PY.FUNCTION_CALL', 'DEFAULT_FUNCTION_CALL', 'TEXT'],
  'method:typescript': JS_MEMBER_FUNCTION,
  'method:typescriptreact': JS_MEMBER_FUNCTION,
  namespace: ['DEFAULT_IDENTIFIER', 'TEXT'],
  parameter: ['DEFAULT_PARAMETER', 'DEFAULT_IDENTIFIER', 'TEXT'],
  property: ['DEFAULT_INSTANCE_FIELD'],
  'property.readonly': ['DEFAULT_INSTANCE_FIELD'],
  'property.static': ['DEFAULT_STATIC_FIELD', 'DEFAULT_INSTANCE_FIELD'],
  'property:python': ['DEFAULT_IDENTIFIER', 'TEXT'],
  selfParameter: ['PY.SELF_PARAMETER', 'DEFAULT_KEYWORD'],
  typeParameter: ['TYPE_PARAMETER_NAME_ATTRIBUTES'],
  'variable.defaultLibrary:javascript': JS_GLOBAL_VARIABLE,
  'variable.defaultLibrary:javascriptreact': JS_GLOBAL_VARIABLE,
  'variable.defaultLibrary:typescript': JS_GLOBAL_VARIABLE,
  'variable.defaultLibrary:typescriptreact': JS_GLOBAL_VARIABLE,
  'variable:python': ['PY.LOCAL_VARIABLE', 'DEFAULT_LOCAL_VARIABLE', 'DEFAULT_IDENTIFIER', 'TEXT'],
};
