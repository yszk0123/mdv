export type VscodeMessage = {
  command: 'update';
  text: string;
};

export type WebviewMessage =
  | {
      command: 'initialize';
    }
  | {
      command: 'update';
      text: string;
    };
