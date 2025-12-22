# Dependency notes

This document lists the reasons why specific dependencies are pinned down to
exact versions. Make sure to consider these points before updating dependencies
to their latest versions.

## `node-ssdp`

We monkey-patch one of the methods of the `Server` class from `node-ssdp`. To
ensure that the patch works, we pinned `node-ssdp` down to the exact version
where we know the patch works. Note that there were no new releases from
`node-ssdp` since 2020 at the time of writing (Dec 2025) so it is not likely
to be a problem.

Should we need to update `node-ssdp` in the future, we can consider using
`patch-package` instead of monkey-patching.
