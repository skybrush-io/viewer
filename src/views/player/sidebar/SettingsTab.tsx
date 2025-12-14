import Box from '@mui/material/Box';
import List from '@mui/material/List';

import DroneSizeSlider from '~/features/settings/DroneSizeSlider';
import FrameRateSelector from '~/features/settings/FrameRateSelector';
import LanguageSelector from '~/features/settings/LanguageSelector';
import PlaybackSpeedSelector from '~/features/settings/PlaybackSpeedSelector';
import ScenerySelector from '~/features/settings/ScenerySelector';
import ThreeDViewSettingToggles from '~/features/settings/ThreeDViewSettingToggles';

/**
 * The settings tab of the player sidebar.
 */
const SettingsTab = () => (
  <List sx={{ background: 'unset' }}>
    <Box px={2}>
      <LanguageSelector />
    </Box>

    <Box px={2} pt={2}>
      <ScenerySelector />
    </Box>

    <Box px={2} pt={2}>
      <PlaybackSpeedSelector />
    </Box>

    <Box px={2} pt={2}>
      <FrameRateSelector />
    </Box>

    <Box px={2} pt={2} pb={1}>
      <DroneSizeSlider />
    </Box>

    <ThreeDViewSettingToggles />
  </List>
);

export default SettingsTab;
