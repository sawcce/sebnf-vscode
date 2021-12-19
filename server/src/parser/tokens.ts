import { createToken, Lexer } from "chevrotain";

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const LineComment = createToken({
  name: "Comment",
  pattern: /#.*?/,
  group: Lexer.SKIPPED,
});
export const InlineComment = createToken({
  name: "InlineComment",
  pattern: /:(.|\s)*;/,
});

export const identifier = createToken({
  name: "identifier",
  pattern: /[_a-zA-Z][_a-zA-Z0-9]*/,
});

export const equals = createToken({ name: "equals", pattern: /=/ });

export const literal = createToken({ name: "literal", pattern: /".*?"/ });

export const lparen = createToken({ name: "lp", pattern: /\(/ });
export const rparen = createToken({ name: "rp", pattern: /\)/ });
export const operator = createToken({ name: "op", pattern: /\*|\+|\?/ });

export const allTokens = [
  identifier,
  equals,
  literal,
  lparen,
  rparen,
  operator,
  LineComment,
  InlineComment,
  WhiteSpace,
];
