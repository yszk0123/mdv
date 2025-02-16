export const Mode = {
  Edit: 'edit',
  View: 'view',
} as const;
export type Mode = (typeof Mode)[keyof typeof Mode];
