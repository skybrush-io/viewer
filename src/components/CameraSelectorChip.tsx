import React from 'react';
import { useState } from 'react';

import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Chip, { ChipProps } from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Camera } from '@skybrush/show-format';

function getLabelForCamera(camera: Camera, index: number): string {
  return camera.name ?? `Camera ${index}`;
}

interface CameraSelectorChipProps extends ChipProps {
  cameras: Camera[];
  hotkeys: string[];
  onCameraSelected: (index: number, camera: Camera) => void;
  selectedCameraIndex: number;
}

/**
 * Chip that allows the user to return to the view of the selected camera or to
 * choose a new camera.
 */
const CameraSelectorChip = ({
  cameras,
  hotkeys,
  onCameraSelected,
  selectedCameraIndex,
  ...rest
}: CameraSelectorChipProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<any>();

  const cameraArray = Array.isArray(cameras) ? cameras : [];
  const selectedCamera =
    selectedCameraIndex >= 0 ? cameraArray[selectedCameraIndex] : null;
  const needsMenu = cameraArray.length > 1;

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleClose = (index: number) => {
    if (onCameraSelected) {
      const camera = index >= 0 ? cameraArray[index] : null;
      if (camera) {
        onCameraSelected(index, camera);
      }
    }

    setOpen(false);
  };

  /* eslint-disable react/no-array-index-key */
  return (
    <div>
      <Chip
        ref={anchorRef}
        id='camera-selector-button'
        aria-controls='camera-selector-menu'
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='outlined'
        label={
          selectedCamera
            ? getLabelForCamera(selectedCamera, selectedCameraIndex)
            : 'No camera'
        }
        deleteIcon={needsMenu ? <ArrowDropDown /> : undefined}
        onClick={
          selectedCamera && onCameraSelected
            ? () => {
                onCameraSelected(selectedCameraIndex, selectedCamera);
              }
            : undefined
        }
        onDelete={needsMenu ? toggleOpen : undefined}
        {...rest}
      />
      <Menu
        aria-labelledby='camera-selector-button'
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      >
        {(cameras || []).map((camera, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose(index);
            }}
          >
            <ListItemText>{getLabelForCamera(camera, index)}</ListItemText>
            {hotkeys[index] && (
              <Typography variant='body1' color='text.secondary' ml={2}>
                {hotkeys[index]}
              </Typography>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
  /* eslint-enable react/no-array-index-key */
};

export default CameraSelectorChip;
