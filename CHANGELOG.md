# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.0] - 2021-11-24

### Added

- Added a camera switcher at the top of the screen; the switcher allows the
  user to select from pre-defined camera configurations if the show file
  specifies them.

- You can now zoom in and out with the scroll wheel or with the +/- keys. This
  is useful in cases when the show file contains a camera preset for the
  audience position but it is far from the show center.

- Added a button in the top overlay that rotates the view towards the center of
  the axis-aligned bounding box of the drones, and another button that resets
  the camera zoom to 1:1.

- You can now drag and drop a .skyc file directly into the viewer window to
  open it.

### Removed

- Removed VR headset toggle from the playback slider as the new camera
  transition framework is not compatible with VR mode. Let us know if you miss
  this feature and we will find a way to implement it again.

## [1.9.5] - 2021-10-24

### Fixed

- Restored the progress indicator while loading a show.

- When viewing an indoor show, a single square on the floor texture now represents
  1 meter instead of 20 meters.

## [1.9.2] - 2021-07-19

### Fixed

- Minimum altitude limit in the viewer is now compensated with the height of
  the camera rig, allowing the viewer to go all the way down to Z = 0.

## [1.9.1] - 2021-07-08

### Changed

- The viewer does not allow the camera to go below Z = 0 any more.

### Fixed

- Holding down the Shift key now also increases velocity along the Z axis.

## [1.9.0] - 2021-07-04

### Added

- Pressing Spacebar or K now starts or stops the playback. Also, you can now
  step forward and backward by 10 seconds by pressing J (backward) or L (forward).

- Audio playback can now be muted or unmuted with P.

### Fixed

- The playhead is now rewound properly when a new show file is loaded from the
  command line while an existing show file is already open.

## [1.8.4] - 2021-07-01

### Fixed

- Restore shaded area between 'minimum' and 'maximum' chart series on the
  validation screen.
- Viewer window is now focused automatically when a new trajectory set is loaded
  from SKybrush Studio.

- Fixed a bug that prevented Skybrush Studio from discovering Viewer on the same
  machine when none of the network interfaces were active.

## [1.8.1] - 2021-05-10

This is the release that serves as a basis for changelog entries above. Refer
to the commit logs for changes affecting this version and earlier versions.
