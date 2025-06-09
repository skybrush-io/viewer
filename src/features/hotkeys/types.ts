export type HotkeyHandler = (keyEvent?: KeyboardEvent) => void;

export type KeyMap<GroupType = unknown, ScopeType = unknown> = Record<
  string,
  // TODO: Use `import { ExtendedKeyMapOptions } from 'react-hotkeys';`!
  {
    name?: string;
    group?: GroupType;
    scopes: ScopeType[];
  } & ({ sequence?: string } | { sequences?: string[] })
>;
