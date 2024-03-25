# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Yaw markers can now be shown on the drones if the input .skyc file supports
  yaw setpoints.

### Changed

- Maximum drone count was bumped from 1000 to 5000.

### Fixed

- Fixed a bug that resulted in incorrect camera rotation when a default camera
  was specified in a show file.

## [2.3.0] - 2022-11-27

### Added

- The scenery can now be replaced with a black background in the 3D view.

### Fixed

- Label placement and size is now also optimized for indoor shows.

## [2.2.2] - 2022-08-06

### Fixed

- The font used in the 3D view is now bundled with the app instead of being
  loaded from a CDN so it works even if you are offline.

## [2.2.1] - 2022-08-01

### Changed

- Labels are now rendered as black with the 'day' scenery to improve
  visibility.

- Glow is not rendered around drones any more with the 'day' scenery.

### Fixed

- Fixed a label placement bug; the anchor point of each label is now the
  baseline of the label to ensure that they float nicely above the drones.

## [2.2.0] - 2022-08-01

### Added

- Added a switch to the sidebar to toggle labels above the drones.

### Fixed

- Fixed a bug in the light program player that rarely showed incorrect colors
  for drones when the show was rewound to an earlier timestamp.

## [2.1.0] - 2022-06-27

### Added

- Added support for having different vertical velocity thresholds upwards and
  downwards in the validation view.

## [2.0.0] - 2022-03-16

### Changed

- Most of the project code was re-written in TypeScript

- The application is now licensed as GNU GPL v3 or later.

Strictly speaking, none of the above are breaking changes, but we believe that
the license change is significant enough to warrant a major version bump.

## [1.10.1] - 2021-12-27

### Fixed

- Fixed a bug in the 3D view where releasing the E/C keys would suddenly make
  the camera animation stop.

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
