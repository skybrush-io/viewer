import mapValues from 'lodash-es/mapValues';
import { type Dispatch, type UnknownAction } from 'redux';

import { isRunningOnMac } from '~/utils/platform';

import type { HotkeyHandler, KeyMap } from './types';
import type { Scope } from 'eslint';

export function bindHotkeyHandlers<D extends Dispatch<UnknownAction>>(
  reduxHandlers: Record<
    string,
    (event?: KeyboardEvent) => Parameters<D>[0] | null
  >,
  nonReduxHandlers: Record<string, HotkeyHandler>,
  dispatch: D
) {
  return {
    ...nonReduxHandlers,
    ...mapValues(reduxHandlers, (handler) => (event?: KeyboardEvent) => {
      if (event?.defaultPrevented) {
        return;
      }

      // Prevent the default action of the event (e.g. scrolling the page)
      event?.preventDefault();

      const maybeAction = handler(event);
      if (maybeAction) {
        dispatch(maybeAction);
      }
    }),
  };
}

/**
 * Helper function that modifies a keymap and replaces "mod" with "meta" on macOS
 * and "ctrl" everywhere else.
 *
 * This is needed because react-hotkeys does not support the "mod" modifier
 * from Mousetrap yet.
 *
 * @param keyMap  the keymap to fix
 * @returns the keymap itself for chaining
 */
export function fixModifiersInKeyMap(keyMap: KeyMap): KeyMap {
  const platModKey = isRunningOnMac ? 'meta+' : 'ctrl+';
  const platformize = (key: string): string => key.replace('mod+', platModKey);

  for (const definition of Object.values(keyMap)) {
    if ('sequence' in definition) {
      definition.sequence = platformize(definition.sequence!);
    } else if (
      'sequences' in definition &&
      Array.isArray(definition.sequences)
    ) {
      definition.sequences = definition.sequences.map(platformize);
    }
  }

  return keyMap;
}

export const isButtonFocused = () =>
  document.activeElement?.tagName === 'BUTTON';

export function onlyWhenNoButtonIsFocused<
  D extends Dispatch,
  T extends any[] = unknown[],
>(actionFactory: (...args: T) => Parameters<D>[0]) {
  return (...args: T) => {
    return !isButtonFocused() ? actionFactory(...args) : null;
  };
}

/**
 * Returns a function that filters a keymap to include only those keys that
 * are  valid for the given scope.
 *
 * @param keyMap  the keymap to filter
 * @param scope   the scope to filter by
 */
export function filterKeyMapByScope<ScopeType>(
  keyMap: KeyMap<unknown, ScopeType>,
  scope: ScopeType
) {
  return Object.fromEntries(
    Object.entries(keyMap).filter(([, value]) => value.scopes.includes(scope))
  );
}
