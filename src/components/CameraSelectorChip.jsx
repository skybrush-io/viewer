import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

function getLabelForCamera(camera, index) {
  return camera.name || `Camera ${index}`;
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
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef();

  const cameraArray = Array.isArray(cameras) ? cameras : [];
  const selectedCamera =
    selectedCameraIndex >= 0 ? cameraArray[selectedCameraIndex] : null;
  const needsMenu = cameraArray.length > 1;

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleClose = (index) => {
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
        label={selectedCamera ? getLabelForCamera(selectedCamera) : 'No camera'}
        deleteIcon={needsMenu ? <ArrowDropDown /> : null}
        onClick={
          selectedCamera && onCameraSelected
            ? () => onCameraSelected(selectedCameraIndex, selectedCamera)
            : null
        }
        onDelete={needsMenu ? toggleOpen : null}
        {...rest}
      />
      <Menu
        aria-labelledby='camera-selector-button'
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      >
        {(cameras || []).map((camera, index) => (
          <MenuItem key={index} onClick={() => handleClose(index)}>
            <ListItemText>{getLabelForCamera(camera, index)}</ListItemText>
            {hotkeys[index] && (
              <Typography variant='body' color='text.secondary' ml={2}>
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

CameraSelectorChip.propTypes = {
  cameras: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['perspective']),
      position: PropTypes.arrayOf(PropTypes.number),
      orientation: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  hotkeys: PropTypes.arrayOf(PropTypes.string),
  onCameraSelected: PropTypes.func,
  selectedCameraIndex: PropTypes.number,
};

export default CameraSelectorChip;
