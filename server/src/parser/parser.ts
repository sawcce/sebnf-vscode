import { EmbeddedActionsParser, ILexingResult, Lexer } from "chevrotain";
import {
  allTokens,
  equals,
  identifier,
  InlineComment,
  literal,
} from "./tokens";

export const lexer = new Lexer(allTokens);

class SEBNFParser extends EmbeddedActionsParser {
  tree(): Output;

  rule: any;
  constructor() {
    super(allTokens);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $ = this;

    $.RULE("tree", () => {
      const tree: any[] = [];
      const rules: Record<string, Rule> = {};

      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              const rule: Rule = $.SUBRULE($.rule);

              tree.push(rule);
              rules[rule.name] = rule;
            },
          },
        ]);
      });

      return { tree, rules };
    });

    $.RULE("rule", () => {
      const { image: name } = $.CONSUME(identifier);
      $.CONSUME(equals);

      const content: any[] = [];

      $.MANY(() => {
        $.OR([
          {
            ALT: () =>
              content.push({
                type: "literal",
                value: $.CONSUME(literal).image,
              }),
          }, // Literals
          {
            ALT: () => {
              content.push({
                type: "subrule",
                name: $.CONSUME1(identifier).image,
              });
            },
          }, // SubRules
        ]);
      });

      let documentation: string | null = "";

      $.OPTION(() => {
        documentation = $.CONSUME(InlineComment).image.slice(1, -1).trim();
      });

      return { type: "rule", name, content, documentation };
    });

    $.performSelfAnalysis();
  }
}

const parser = new SEBNFParser();

type Content = string[];

export type Rule = {
  name: string;
  documentation: string;
  content: Content;
};

export type Output = {
  tree: Rule[];
  rules: Record<string, Rule>;
};

export type o = {
  tree: Rule[];
  rules: Record<string, Rule>;
  tokens: ILexingResult;
};

export function Parse(str: string): o {
  const tokens = lexer.tokenize(str);
  parser.input = tokens.tokens;
  const { tree, rules } = parser.tree();

  if (parser.errors.length > 0) {
    console.log(parser.errors);
  }

  return { tree, rules, tokens };
}

export function ValidateTree() {}
