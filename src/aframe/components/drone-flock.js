/**
 * A-Frame component that implements the logic needed to implement a
 * "drone flock" entity consisting of multiple drones backed by a `Flock`
 * instance.
 */

import watch from 'redux-watch';
import AFrame from '@skybrush/aframe-components';
import { createSelectionHandlerThunk } from '@skybrush/redux-toolkit';

import { DEFAULT_DRONE_MODEL } from '~/constants';
import { getElapsedSecondsGetter } from '~/features/playback/selectors';
import { getSelectedDroneIndices } from '~/features/selection/selectors';
import { setSelectedDroneIndices } from '~/features/selection/slice';
import {
  getLightProgramPlayers,
  getTrajectoryPlayers,
  getYawControlPlayers,
} from '~/features/show/selectors';
import store from '~/store';

import fontUrl from '~/../assets/fonts/Roboto-msdf.json';
import fontImageUrl from '~/../assets/fonts/Roboto-msdf.png';
import { SELECTABLE_OBJECT_CLASS } from '~/views/player/constants';

const { THREE } = AFrame;

const defaultGeometry = Object.freeze({
  primitive: 'sphere',
  radius: 1,
  segmentsHeight: 9,
  segmentsWidth: 18,
});

/**
 * Convenience function to create the props of a flat-shaded material to use
 * with drones.
 */
function createFlatShadedMaterialProps() {
  return {
    color: new THREE.Color('#0088ff'),
    fog: false,
    shader: 'flat',
  };
}

/**
 * Convenience function to create the props of a glowing material to use
 * with drones.
 *
 * Does not work yet; need to investigate why.
 */
function createGlowingMaterialProps() {
  return {
    color: new THREE.Color('#0088ff'),
    falloff: 1.5,
    internalRadius: 5,
    sharpness: 0,
  };
}

/**
 * Convenience function to create an AFrame entity with attributes.
 */
function createEntity(props = {}, children = []) {
  const element = document.createElement('a-entity');

  for (const [name, value] of Object.entries(props)) {
    element.setAttribute(name, value);
  }

  for (const child of children) {
    element.append(child);
  }

  return element;
}

function getDroneFromEntity(entity) {
  // We assume that the drone is the first child
  return entity.childNodes[0];
}

function getDroneMeshFromEntity(entity) {
  return getDroneFromEntity(entity)?.getObject3D('mesh');
}

function getGlowMeshFromEntity(entity) {
  // We assume that the glow is the third child
  return entity.childNodes[2]?.getObject3D('mesh');
}

function getLabelFromEntity(entity) {
  // We assume that the label is the second child
  return entity.childNodes[1];
}

function getYawIndicatorFromEntity(entity) {
  // We assume that the yaw marker is the first child of the drone
  return getDroneFromEntity(entity)?.childNodes[0];
}

const DEFAULT_LABEL_SCALE = 3;
const DEFAULT_LABEL_OFFSET = DEFAULT_LABEL_SCALE / 2;

AFrame.registerSystem('drone-flock', {
  init() {
    const boundGetElapsedSecodsGetter = () =>
      getElapsedSecondsGetter(store.getState());
    store.subscribe(
      watch(boundGetElapsedSecodsGetter)((newGetter) => {
        this._getElapsedSeconds = newGetter;
      })
    );

    this._selectionThunk = createSelectionHandlerThunk({
      getSelection: getSelectedDroneIndices,
      setSelection: setSelectedDroneIndices,
    });

    this.currentTime = 0;
    this._getElapsedSeconds = boundGetElapsedSecodsGetter();
    this._vec = new THREE.Vector3();

    this._entityFactories = {
      default: this._createDefaultUAVEntity.bind(this),
      flapper: this._createFlapperDroneEntity.bind(this),
      quad: this._createQuadcopterEntity.bind(this),
    };

    this.rotateEntityLabelTowards = this.rotateEntityLabelTowards.bind(this);
  },

  createNewUAVEntity({
    droneModel,
    label,
    labelColor,
    showGlow,
    showLabel,
    showYaw,
  }) {
    const factory =
      this._entityFactories[droneModel] ?? this._entityFactories.default;
    const droneEntity = factory();
    droneEntity.setAttribute('material', createFlatShadedMaterialProps());

    droneEntity.append(this._createYawIndicatorEntity(showYaw));

    const labelEntity = this._createLabelEntity(label, showLabel, labelColor);
    const children = [droneEntity, labelEntity];

    if (showGlow) {
      children.push(this._createGlowEntity());
    }

    return createEntity({ position: '0 0 0' }, children);
  },

  _createGlowEntity() {
    return createEntity({
      geometry: defaultGeometry,
      'glow-material': createGlowingMaterialProps(),
      scale: '3 3 3',
    });
  },

  _createLabelEntity(label, visible, color = 'white') {
    const labelElement = document.createElement('a-entity');
    labelElement.setAttribute('text', {
      color,
      font: fontUrl,
      fontImage: fontImageUrl,
      value: label,
      align: 'center',
      anchor: 'center',
      baseline: 'bottom',
      wrapCount: 4 /* fit ~4 chars inside the given width */,
      width: 1,
    });

    const labelScale = DEFAULT_LABEL_SCALE;
    const labelOffset = DEFAULT_LABEL_OFFSET;
    labelElement.setAttribute('position', `0 0 ${labelOffset}`);
    labelElement.setAttribute('rotation', '0 -90 -90');
    labelElement.setAttribute(
      'scale',
      `${labelScale} ${labelScale} ${labelScale}`
    );
    labelElement.setAttribute('visible', visible ? 'true' : 'false');

    return labelElement;
  },

  _createYawIndicatorEntity(showYaw = false) {
    const cylinder = createEntity({
      geometry: {
        primitive: 'cylinder',
        radius: 1 / 10,
        height: 1,
      },
      material: {
        color: new THREE.Color('#ff0000'),
        shader: 'flat',
      },
      rotation: '0 0 90',
      position: '1.2 0 0',
    });

    return createEntity(
      {
        visible: showYaw ? 'true' : false,
      },
      [cylinder]
    );
  },

  _createDefaultUAVEntity() {
    return createEntity({
      geometry: defaultGeometry,
    });
  },

  _createFlapperDroneEntity() {
    return createEntity({
      'obj-model': {
        obj: '#flapper-drone',
      },
    });
  },

  _createQuadcopterEntity() {
    return createEntity({
      'obj-model': {
        obj: '#quadcopter',
      },
    });
  },

  createTrajectoryPlayerForIndex(index) {
    return this._createTrajectoryPlayerForIndex(index);
  },

  tick() {
    this.currentTime = this._getElapsedSeconds();
  },

  resetLabelScaleAndPosition(entity) {
    const label = getLabelFromEntity(entity);
    if (label) {
      const labelScale = DEFAULT_LABEL_SCALE;
      const labelOffset = DEFAULT_LABEL_OFFSET;

      label.object3D.position.set(0, -0.05, labelOffset);
      label.object3D.scale.set(labelScale, labelScale, labelScale);
    }
  },

  rotateEntityLabelTowards(entity, position, data) {
    const { droneRadius, scaleLabels } = data;
    const label = getLabelFromEntity(entity);
    const scalingFactor = 1;

    if (label) {
      if (scaleLabels) {
        entity.object3D.getWorldPosition(this._vec);
        const distance = this._vec.distanceTo(position);
        const scale = (distance * scalingFactor) / (20 * droneRadius);
        label.object3D.scale.set(scale, scale, scale);
        label.object3D.position.z = scalingFactor + scale * (droneRadius / 8);
      }

      label.object3D.lookAt(position);
    }
  },

  updateEntityPose(entity, rotation) {
    const drone = getDroneFromEntity(entity);
    if (drone) {
      /* Angle has to be inverted because Skybrush yaw angles increase in
       * clockwise order */
      drone.object3D.rotation.z = -rotation.z;
    }
  },

  updateEntityPositionAndColor(entity, position, color) {
    entity.object3D.position.copy(position);

    const droneMesh = getDroneMeshFromEntity(entity);
    droneMesh?.material?.color.copy(color);

    const glowMesh = getGlowMeshFromEntity(entity);
    glowMesh?.material?.color.copy(color);
  },

  updateEntitySize(entity, size) {
    entity.object3D.scale.set(size, size, size);
  },

  updateGlowVisibility(entity, visible) {
    const glowMesh = getGlowMeshFromEntity(entity);
    if (glowMesh) {
      glowMesh.visible = visible;
    }
  },

  updateLabelColor(entity, color) {
    const label = getLabelFromEntity(entity);
    if (label) {
      label.setAttribute('text', 'color', color);
    }
  },

  updateLabelVisibility(entity, visible) {
    const label = getLabelFromEntity(entity);
    if (label) {
      label.object3D.visible = visible;
    }
  },

  updateYawIndicatorVisibility(entity, visible) {
    const yaw = getYawIndicatorFromEntity(entity);
    if (yaw) {
      yaw.object3D.visible = visible;
    }
  },
});

AFrame.registerComponent('drone-flock', {
  schema: {
    droneModel: { default: DEFAULT_DRONE_MODEL },
    droneRadius: { default: 1 },
    labelColor: { default: 'white' },
    scaleLabels: { default: false },
    showGlow: { default: true },
    showLabels: { default: false },
    showYaw: { default: false },
    size: { default: 0 },
  },

  init() {
    this._drones = [];

    this._cameraPosition = new THREE.Vector3();
    this._color = new THREE.Color();
    this._colorArray = [0, 0, 0];
    this._vec = new THREE.Vector3();
    this._rot = new THREE.Euler();

    const boundGetTrajectoryPlayers = () =>
      getTrajectoryPlayers(store.getState());
    store.subscribe(
      watch(boundGetTrajectoryPlayers)((trajectoryPlayers) => {
        this._trajectoryPlayers = trajectoryPlayers;
      })
    );

    const boundGetLightProgramPlayers = () =>
      getLightProgramPlayers(store.getState());
    store.subscribe(
      watch(boundGetLightProgramPlayers)((lightProgramPlayers) => {
        this._lightProgramPlayers = lightProgramPlayers;
      })
    );

    const boundGetYawControlPlayers = () =>
      getYawControlPlayers(store.getState());
    store.subscribe(
      watch(boundGetYawControlPlayers)((yawControlPlayers) => {
        this._yawControlPlayers = yawControlPlayers;
      })
    );

    this._lightProgramPlayers = boundGetLightProgramPlayers();
    this._trajectoryPlayers = boundGetTrajectoryPlayers();
    this._yawControlPlayers = boundGetYawControlPlayers();
  },

  remove() {},

  tick() {
    const {
      currentTime,
      rotateEntityLabelTowards,
      updateEntityPositionAndColor,
      updateEntityPose,
    } = this.system;
    const vec = this._vec;
    const rot = this._rot;
    const color = this._color;
    const colorArray = this._colorArray;
    const camera = this.el.sceneEl.camera;
    const showLabels = this.data.showLabels;

    this._cameraPosition.setFromMatrixPosition(camera.matrixWorld);

    for (const item of this._drones) {
      const { entity, index } = item;

      const lightProgramPlayer = this._lightProgramPlayers[index];
      const trajectoryPlayer = this._trajectoryPlayers[index];
      const yawControlPlayer = this._yawControlPlayers[index];

      if (trajectoryPlayer) {
        trajectoryPlayer.getPositionAt(currentTime, vec);
      } else {
        vec.setScalar(0);
      }

      if (yawControlPlayer) {
        yawControlPlayer.getYawAt(currentTime, rot);
      } else {
        rot.set(0, 0, 0);
      }

      if (lightProgramPlayer) {
        lightProgramPlayer.evaluateColorAt(currentTime, colorArray);
        color.fromArray(colorArray);
      } else {
        color.setScalar(0.5);
      }

      updateEntityPositionAndColor(entity, vec, color);
      updateEntityPose(entity, rot);

      if (showLabels) {
        rotateEntityLabelTowards(entity, this._cameraPosition, this.data);
      }
    }
  },

  /* eslint-disable complexity */
  update(oldData) {
    const oldDroneModel = oldData.droneModel ?? 'sphere';
    const oldDroneRadius = oldData.droneRadius || 0;
    const oldShowGlow = Boolean(oldData.showGlow ?? true);
    const oldShowLabels = Boolean(oldData.showLabels);
    const oldShowYaw = Boolean(oldData.showYaw ?? false); // or no default?
    const oldScaleLabels = Boolean(oldData.scaleLabels);
    const oldLabelColor = oldData.labelColor ?? '#888';
    const {
      droneModel,
      droneRadius,
      labelColor,
      scaleLabels,
      showGlow,
      showLabels,
      showYaw,
      size,
    } = this.data;
    let oldSize = oldData.size || 0;
    let forceDroneSizeUpdate = false;

    if (oldDroneModel !== droneModel) {
      // Remove all existing entities as we need to re-create all of them
      // from scratch
      while (this._drones.length > 0) {
        const { entity } = this._drones.pop();
        entity.remove();
      }

      oldSize = 0;
    }

    if (size > oldSize) {
      // Add new drones
      for (let i = oldSize; i < size; i++) {
        const entity = this.system.createNewUAVEntity({
          droneModel,
          label: String(i + 1),
          labelColor,
          showGlow,
          showLabel: showLabels,
          showYaw,
        });
        this.el.append(entity);

        const droneEntity = getDroneFromEntity(entity);
        droneEntity.className = SELECTABLE_OBJECT_CLASS;
        droneEntity.addEventListener('click', (event) => {
          this.el.sceneEl.systems['modifier-keys'].updateSyntheticEvent(event);
          store.dispatch(this.system._selectionThunk(i, event));
          event.stopPropagation();
        });

        this._drones.push({ index: i, entity });
      }

      forceDroneSizeUpdate = true;
    } else {
      // Remove unneeded drones
      for (let i = size; i < oldSize; i++) {
        const { entity } = this._drones.pop();
        entity.remove();
      }
    }

    if (oldDroneRadius !== droneRadius || forceDroneSizeUpdate) {
      // Update drone sizes
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateEntitySize(entity, droneRadius);
      }
    }

    if (oldLabelColor !== labelColor) {
      // Update label color
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateLabelColor(entity, labelColor);
      }
    }

    if (oldShowGlow !== showGlow) {
      // Update glow visibility
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateGlowVisibility(entity, showGlow);
      }
    }

    if (oldShowLabels !== showLabels) {
      // Update label visibility
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateLabelVisibility(entity, showLabels);
      }
    }

    if (oldShowYaw !== showYaw) {
      // Update yaw visibility
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateYawIndicatorVisibility(entity, showYaw);
      }
    }

    if (oldScaleLabels !== scaleLabels && !scaleLabels) {
      // Reset the scale and position of each label
      for (const item of this._drones) {
        const { entity } = item;
        this.system.resetLabelScaleAndPosition(entity);
      }
    }
  },
  /* eslint-enable complexity */
});
