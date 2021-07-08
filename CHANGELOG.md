# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.1] - 2021-07-08

### Fixed

- Holding down the Shift key now also increases velocity along the Z axis.

- The viewer does not allow the camera to go below Z = 0 any more.

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
