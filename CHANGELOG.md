# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.8.0] - 2025-12-12

### Added

- The version number of the application is now shown in the sidebar.

### Changed

- Proximity calculations now ignore the drones whose current position is equal to
  their takeoff or landing position. This policy was introduced to exclude drones on
  the ground from proximity calculations in multi-stage shows. When all the drones
  are at their takeoff or landing positions, proximity is calculated normally.

### Fixed

- When cueing the show using hotkeys, snap the displayed timestamp to the nearest
  frame (even though Skybrush shows are technically not based on frames).

## [2.7.0] - 2025-09-02

### Added

- Added Japanese translation of the user interface. Many thanks to our contributors!

- Added a "Reload show" button to the playback bar and the validation view.

- Added info to the metadata listing of the show file about pyro control.

### Changed

- The macOS version of the application now uses a title bar just like on other
  platforms for sake of consistency.

### Fixed

- Prevented the glow shader from adding a halo effect to dark colors.

- Camera pose is now remembered when entering and exiting validation view.

## [2.6.0] - 2025-06-17

### Added

- Added Chinese translation of the user interface. Many thanks to our contributors!

- Playback speed can now be set to 0.5x and 0.25x

- Pressing `?` now shows a dialog summarizing the available hotkeys.

- Drones can be selected by clicking on them. Multiple selection is possible by
  holding down the Ctrl key (Cmd on macOS) while clicking.

- The sidebar panel is now persistent and consists of two tabs: settings (as in
  previous versions) and an inspector panel. The inspector panel shows the
  current timestamp, metadata and the cue list of the show. It also shows the
  positions, velocities and colors of selected drones.

### Changed

- The current position on the playhead can now be adjusted with smaller
  granularity. The assumed frame rate (for stepping through the show by
  frames) can be set in the settings.

## [2.5.0] - 2025-02-06

### Added

- Added Chinese localization.

- The web-based Viewer version now has a "Share" button in the playback bar
  that can be used to create a link to an exact timestamp and camera position
  of the show.

## [2.4.1] - 2024-11-13

### Changed

- The Y axis of the proximity chart now always starts from zero.

## [2.4.0] - 2024-09-05

### Added

- Drones can now be scaled in the 3D view with a slider in the settings sidebar.

- Yaw markers can now be shown on the drones if the input .skyc file supports
  yaw setpoints.

- Added language selector in the sidebar. Currently the app supports English and
  Hungarian. See <https://skybrush.io/blog/2024-01-18-help-us-translate-skybrush-live/>
  if you would like to help translating Viewer into your own language.

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
