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
  { from: ['DEFAULT_TAG', 'HTML_TAG', 'TEXT'], name: 'Tag punctuation', scope: ['punctuation.definition.tag', 'meta.tag punctuation'] },
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
  { from: ['REGEXP.CHAR_CLASS', 'JS.REGEXP', 'DEFAULT_VALID_STRING_ESCAPE'], name: 'Regex', scope: ['string.regexp', 'constant.other.character-class.regexp'] },
  { from: ['REGEXP.META', 'DEFAULT_KEYWORD'], name: 'Regex meta', scope: ['keyword.operator.quantifier.regexp', 'keyword.control.anchor.regexp', 'punctuation.definition.group.regexp'] },

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
  'method:python': ['PY.METHOD_CALL', 'PY.FUNCTION_CALL', 'DEFAULT_FUNCTION_CALL', 'TEXT'],
  namespace: ['DEFAULT_IDENTIFIER', 'TEXT'],
  parameter: ['DEFAULT_PARAMETER', 'DEFAULT_IDENTIFIER', 'TEXT'],
  property: ['DEFAULT_INSTANCE_FIELD'],
  'property.readonly': ['DEFAULT_INSTANCE_FIELD'],
  'property.static': ['DEFAULT_STATIC_FIELD', 'DEFAULT_INSTANCE_FIELD'],
  'property:python': ['DEFAULT_IDENTIFIER', 'TEXT'],
  selfParameter: ['PY.SELF_PARAMETER', 'DEFAULT_KEYWORD'],
  typeParameter: ['TYPE_PARAMETER_NAME_ATTRIBUTES'],
  'variable:python': ['PY.LOCAL_VARIABLE', 'DEFAULT_LOCAL_VARIABLE', 'DEFAULT_IDENTIFIER', 'TEXT'],
};
