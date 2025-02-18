export interface ParserOptions {
  customHeader?: {
    heading: string;
    headingN?: string[];
    orderedList: string;
    unorderedList: string;
  };
}

export interface Configuration {
  parserOptions?: ParserOptions;
}

export const DEFAULT_HEADER = 'Item ${depth}';

export const DEFAULT_CONFIGURATION: Configuration = {
  parserOptions: {
    customHeader: {
      heading: DEFAULT_HEADER,
      orderedList: DEFAULT_HEADER,
      unorderedList: DEFAULT_HEADER,
    },
  },
};

export type VscodeMessage =
  | {
      command: 'update';
      text: string;
    }
  | {
      command: 'updateConfiguration';
      config: Configuration;
    };

export type WebviewMessage =
  | {
      command: 'initialize';
    }
  | {
      command: 'update';
      text: string;
    };
