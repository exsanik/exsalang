export const tokens = {
  NUMBER: "NUMBER",
  STRING: "STRING",

  SEMICOLON: ";",
  OPEN_CURLY_BRACE: "{",
  CLOSE_CURLY_BRACE: "}",
  OPEN_PARENTHESIS: "(",
  OPEN_SQUARE_BRACKET: "[",
  CLOSE_SQUARE_BRACKET: "]",
  COMA: ",",
  DOT: ".",
  COLON: ":",

  ADDITIVE_OPERATOR: "ADDITIVE_OPERATOR",
  MULTIPLICATIVE_OPERATOR: "MULTIPLICATIVE_OPERATOR",
  RELATIONAL_OPERATOR: "RELATIONAL_OPERATOR",
  EQUALITY_OPERATOR: "EQUALITY_OPERATOR",

  IDENTIFIER: "IDENTIFIER",

  SIMPLE_ASSIGN: "SIMPLE_ASSIGN",
  COMPLEX_ASSIGN: "COMPLEX_ASSIGN",

  LET: "let",
  IF: "if",
  ELSE: "else",

  TRUE: "true",
  FALSE: "false",
  NULL: "null",
  UNDEFINED: "undefined",

  LOGICAL_AND: "and",
  LOGICAL_OR: "or",
  LOGICAL_NOT: "not",

  WHILE: "while",
  DO: "do",
  FOR: "for",
  FOREACH: "foreach",
  IN: "in",
  DEF: "def",
  RETURN: "return",
  CLASS: "class",
  EXTENDS: "extends",
  SUPER: "super",
  NEW: "new",
  IMPORT: "import",
  FROM: "from",
};

export const SPEC = [
  // keywords
  { regex: /^\blet\b/, type: tokens.LET },
  { regex: /^\bif\b/, type: tokens.IF },
  { regex: /^\belse\b/, type: tokens.ELSE },
  { regex: /^\btrue\b/, type: tokens.TRUE },
  { regex: /^\bfalse\b/, type: tokens.FALSE },
  { regex: /^\bnull\b/, type: tokens.NULL },
  { regex: /^\bundefined\b/, type: tokens.UNDEFINED },
  { regex: /^\band\b/, type: tokens.LOGICAL_AND },
  { regex: /^\bor\b/, type: tokens.LOGICAL_OR },
  { regex: /^\bnot\b/, type: tokens.LOGICAL_NOT },
  { regex: /^\bwhile\b/, type: tokens.WHILE },
  { regex: /^\bdo\b/, type: tokens.DO },
  { regex: /^\bfor\b/, type: tokens.FOR },
  { regex: /^\bforeach\b/, type: tokens.FOREACH },
  { regex: /^\bin\b/, type: tokens.IN },
  { regex: /^\bdef\b/, type: tokens.DEF },
  { regex: /^\breturn\b/, type: tokens.RETURN },
  { regex: /^\bclass\b/, type: tokens.CLASS },
  { regex: /^\bextends\b/, type: tokens.EXTENDS },
  { regex: /^\bsuper\b/, type: tokens.SUPER },
  { regex: /^\bnew\b/, type: tokens.NEW },
  { regex: /^\bimport\b/, type: tokens.IMPORT },
  { regex: /^\bfrom\b/, type: tokens.FROM },
  // { regex: /^\bthis\b/, type: tokens.THIS },

  { regex: /^\d+[.]?(\d+)?/, type: tokens.NUMBER },

  { regex: /^"[^"]*"/, type: tokens.STRING },
  { regex: /^'[^']*'/, type: tokens.STRING },

  // whitespace
  { regex: /^\s+/, type: null },

  // single line comment
  { regex: /^\/\/.*/, type: null },
  /* multiline comment */
  { regex: /^\/\*[\s\S]*?\*\//, type: null },

  { regex: /^\w+/, type: tokens.IDENTIFIER },

  { regex: /^[=!]=/, type: tokens.EQUALITY_OPERATOR },

  { regex: /^=+/, type: tokens.SIMPLE_ASSIGN },
  { regex: /^[\*\/\+\-]=+/, type: tokens.COMPLEX_ASSIGN },

  { regex: /^[><]=?/, type: tokens.RELATIONAL_OPERATOR },

  { regex: /^;/, type: tokens.SEMICOLON },
  { regex: /^:/, type: tokens.COLON },
  { regex: /^\{/, type: tokens.OPEN_CURLY_BRACE },
  { regex: /^\}/, type: tokens.CLOSE_CURLY_BRACE },
  { regex: /^\(/, type: tokens.OPEN_PARENTHESIS },
  { regex: /^\)/, type: tokens.CLOSE_PARENTHESIS },
  { regex: /^,/, type: tokens.COMA },
  { regex: /^\[/, type: tokens.OPEN_SQUARE_BRACKET },
  { regex: /^\]/, type: tokens.CLOSE_SQUARE_BRACKET },
  { regex: /^\./, type: tokens.DOT },

  { regex: /^[+\-]/, type: tokens.ADDITIVE_OPERATOR },
  { regex: /^[*\/]/, type: tokens.MULTIPLICATIVE_OPERATOR },
];
