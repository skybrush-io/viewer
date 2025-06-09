/**
 * @file React Component for handling hotkeys.
 */

import React, { useEffect, useState } from 'react';
import {
  getApplicationKeyMap,
  type KeyMapDisplayOptions,
  type MouseTrapKeySequence,
} from 'react-hotkeys';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import DraggableDialog from '@skybrush/mui-components/lib/DraggableDialog';

import { isRunningOnMac, platformModifierKey } from '~/utils/platform';

import { HotkeyGroup } from './keymap';
import { isHotkeyDialogVisible } from './selectors';
import { closeHotkeyDialog } from './slice';
import type { RootState } from '~/store';
import { useTranslation } from 'react-i18next';

/**
 * Formats the given hotkey sequence to make it suitable for the user.
 *
 * This function replaces all occurrences of "Cmd" with the standard
 * "command" symbol and all occurrences of "Alt" with the standard
 * "option" symbol on a Mac (i.e. Unicode code points U+2318 and U+2325).
 * It also replaces "Shift" with the standard "shift" symbol (Unicode code
 * point U+21E7) on all platforms, "PlatMod" with "Ctrl" on Windows and the
 * "command" symbol on a Mac, gets rid of the "Key" prefix and wraps each
 * key in a <code>&lt;kbd&gt;</code> tag.
 *
 * @param definition  the hotkey sequence to format
 * @return {array} the formatted hotkey definition as an array of JSX tags
 */
function formatKeySequence(
  definition: MouseTrapKeySequence
): React.JSX.Element[] {
  const parts =
    typeof definition === 'string' ? definition.split('+') : definition;
  return parts.map((key) => {
    const formattedKey = key
      .trim()
      .toLowerCase()
      .replace(/^mod$/, platformModifierKey)
      .replace(/^cmd$/, '⌘')
      .replace(/^meta$/, '⌘')
      .replace(/^alt$/, isRunningOnMac ? '⌥' : 'Alt')
      .replace(/^shift/, '⇧')
      .replace(/^del$/, isRunningOnMac ? '⌦' : 'Delete');
    return (
      <kbd key={key}>
        {formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1)}
      </kbd>
    );
  });
}

const keysColumnStyle = { width: 120 };
const nameColumnStyle = { maxWidth: '99%' };

type HotkeyRowProps = {
  name?: string;
  sequences: KeyMapDisplayOptions['sequences'];
};

const HotkeyRow = ({ name, sequences }: HotkeyRowProps) => (
  <TableRow>
    <TableCell style={keysColumnStyle} padding='none'>
      {sequences.map(({ sequence }) => formatKeySequence(sequence))}
    </TableCell>
    <TableCell style={nameColumnStyle}>{name}</TableCell>
  </TableRow>
);

type HotkeyDialogProps = {
  onClose: () => void;
  open: boolean;
};

/**
 * Dialog that shows the current list of hotkeys.
 */
const HotkeyDialog = ({ onClose, open }: HotkeyDialogProps) => {
  const [hotkeys, setHotkeys] = useState(() => getApplicationKeyMap());
  const { t } = useTranslation();

  useEffect(() => {
    setHotkeys(getApplicationKeyMap());
  }, [open]);

  return (
    <DraggableDialog
      title={t('hotkeys.dialogTitle')}
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <Table size='small'>
          <TableBody>
            {Object.entries(hotkeys || {}).map(
              ([hotkey, { group, name, sequences }]) =>
                group !== HotkeyGroup.HIDDEN && (
                  <HotkeyRow
                    key={hotkey}
                    name={(name && t(`hotkeys.${name}`)) ?? name}
                    sequences={sequences}
                  />
                )
            )}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button color='primary' onClick={onClose}>
          {t('buttons.close')}
        </Button>
      </DialogActions>
    </DraggableDialog>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    open: isHotkeyDialogVisible(state),
  }),
  // mapDispatchToProps
  {
    onClose: closeHotkeyDialog,
  }
)(HotkeyDialog);
