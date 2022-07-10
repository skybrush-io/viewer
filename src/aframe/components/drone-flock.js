/**
 * A-Frame component that implements the logic needed to implement a
 * "drone flock" entity consisting of multiple drones backed by a `Flock`
 * instance.
 */

import watch from 'redux-watch';
import AFrame from '@skybrush/aframe-components';

import { getElapsedSecondsGetter } from '~/features/playback/selectors';
import {
  getLightProgramPlayers,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import store from '~/store';

const { THREE } = AFrame;

const defaultGeometry = {
  primitive: 'sphere',
  radius: 1,
  segmentsHeight: 9,
  segmentsWidth: 18,
};

function getGlowMeshFromEntity(entity) {
  // We assume that the label is the first child and the glow is the second
  const glowEntity = entity.childNodes[1];
  return glowEntity ? glowEntity.getObject3D('mesh') : undefined;
}

function getLabelFromEntity(entity) {
  // We assume that the label is the first child and the glow is the second
  return entity.childNodes[0];
}

const DEFAULT_LABEL_SCALE = 3;

AFrame.registerSystem('drone-flock', {
  init() {
    const boundGetElapsedSecodsGetter = () =>
      getElapsedSecondsGetter(store.getState());
    store.subscribe(
      watch(boundGetElapsedSecodsGetter)((newGetter) => {
        this._getElapsedSeconds = newGetter;
      })
    );

    this.currentTime = 0;
    this._getElapsedSeconds = boundGetElapsedSecodsGetter();
    this._vec = new THREE.Vector3();

    this._entityFactories = {
      default: this._createDefaultUAVEntity.bind(this),
      flapper: this._createFlapperDroneEntity.bind(this),
    };

    this.rotateEntityLabelTowards = this.rotateEntityLabelTowards.bind(this);
  },

  createNewUAVEntity({ type, droneSize, label, showLabel }) {
    const factory =
      this._entityFactories[type] || this._entityFactories.default;
    const element = factory(droneSize);

    element.append(this._createLabelEntity(label, showLabel));
    element.append(this._createGlowEntity(droneSize));

    return element;
  },

  _createGlowEntity(droneSize = 1) {
    const glowElement = document.createElement('a-entity');
    glowElement.setAttribute('sprite', {
      blending: 'additive',
      color: new THREE.Color('#ff8800'),
      scale: `${droneSize * 4} ${droneSize * 4} 1`,
      src: '#glow-texture',
      transparent: true,
    });
    return glowElement;
  },

  _createLabelEntity(label, visible) {
    const labelElement = document.createElement('a-entity');
    labelElement.setAttribute('text', {
      value: label,
      align: 'center',
      anchor: 'center',
      wrapCount: 4 /* fit ~4 chars inside the given width */,
      width: 1,
    });

    /* Y coordinate is slightly offset from zero to prevent Z-fighting with the
     * glow sprite */
    labelElement.setAttribute('position', '0 -0.05 1.5');
    labelElement.setAttribute('rotation', '0 -90 -90');
    labelElement.setAttribute(
      'scale',
      `${DEFAULT_LABEL_SCALE} ${DEFAULT_LABEL_SCALE} ${DEFAULT_LABEL_SCALE}`
    );
    labelElement.setAttribute('visible', visible ? 'true' : 'false');

    return labelElement;
  },

  _createDefaultUAVEntity(droneSize = 1) {
    const element = document.createElement('a-entity');
    element.setAttribute('geometry', {
      ...defaultGeometry,
      radius: droneSize,
    });
    element.setAttribute('material', {
      color: new THREE.Color('#0088ff'),
      fog: false,
      shader: 'flat',
    });
    element.setAttribute('position', '0 0 0');

    return element;
  },

  _createFlapperDroneEntity() {
    const element = document.createElement('a-entity');
    element.setAttribute('obj-model', {
      obj: '#flapper',
    });
    element.setAttribute('material', {
      color: new THREE.Color('#0088ff'),
      fog: false,
      shader: 'flat',
    });
    element.setAttribute('position', '0 0 0');
    // el.setAttribute('rotation', '90 0 0');
    // el.setAttribute('scale', '6 6 6');

    setTimeout(() => {
      element.setAttribute('glow', {
        c: 0.6,
        p: 6,
        color: '#0088ff',
        scale: 1.5,
        side: 'back',
      });
    }, 1000);
    // el.append(this._createGlowEntity(1 / 3));

    return element;
  },

  createTrajectoryPlayerForIndex(index) {
    return this._createTrajectoryPlayerForIndex(index);
  },

  tick() {
    this.currentTime = this._getElapsedSeconds();
  },

  resetLabelScale(entity) {
    const label = getLabelFromEntity(entity);

    if (label) {
      label.object3D.scale.set(
        DEFAULT_LABEL_SCALE,
        DEFAULT_LABEL_SCALE,
        DEFAULT_LABEL_SCALE
      );
    }
  },

  rotateEntityLabelTowards(entity, position, data) {
    const { droneSize, scaleLabels } = data;
    const label = getLabelFromEntity(entity);

    if (label) {
      if (scaleLabels) {
        entity.object3D.getWorldPosition(this._vec);
        const distance = this._vec.distanceTo(position);
        const scale = distance / (20 * droneSize);
        label.object3D.scale.set(scale, scale, scale);
        label.object3D.position.z = 1 + scale * (droneSize / 8);
      }

      label.object3D.lookAt(position);
    }
  },

  updateEntityPositionAndColor(entity, position, color) {
    entity.object3D.position.copy(position);

    const mesh = entity.getObject3D('mesh');
    if (mesh) {
      mesh.material.color.copy(color);
    } else {
      // TODO(ntamas): sometimes it happens that we get here earlier than the
      // mesh is ready (it's an async process). In this case we should store
      // the color somewhere and attempt setting it again in case there will be
      // no further updates from the UAV for a while
    }

    const glowMesh = getGlowMeshFromEntity(entity);
    if (glowMesh && glowMesh.material) {
      glowMesh.material.color.copy(color);
    }
  },

  updateEntitySize(entity, size) {
    entity.setAttribute('geometry', {
      ...defaultGeometry,
      radius: size,
    });

    const glowMesh = getGlowMeshFromEntity(entity);
    if (glowMesh && glowMesh.scale) {
      glowMesh.scale.set(size * 4, size * 4, 1);
    }
  },

  updateLabelVisibility(entity, visible) {
    const label = getLabelFromEntity(entity);
    if (label) {
      label.object3D.visible = visible;
    }
  },
});

AFrame.registerComponent('drone-flock', {
  schema: {
    droneSize: { default: 1 },
    scaleLabels: { default: false },
    showLabels: { default: false },
    size: { default: 0 },
    type: { default: 'default' },
  },

  init() {
    this._drones = [];

    this._cameraPosition = new THREE.Vector3();
    this._color = new THREE.Color();
    this._colorArray = [0, 0, 0];
    this._vec = new THREE.Vector3();

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

    this._lightProgramPlayers = boundGetLightProgramPlayers();
    this._trajectoryPlayers = boundGetTrajectoryPlayers();
  },

  remove() {},

  tick() {
    const {
      currentTime,
      rotateEntityLabelTowards,
      updateEntityPositionAndColor,
    } = this.system;
    const vec = this._vec;
    const color = this._color;
    const colorArray = this._colorArray;
    const camera = this.el.sceneEl.camera;
    const showLabels = this.data.showLabels;

    this._cameraPosition.setFromMatrixPosition(camera.matrixWorld);

    for (const item of this._drones) {
      const { entity, index } = item;

      const lightProgramPlayer = this._lightProgramPlayers[index];
      const trajectoryPlayer = this._trajectoryPlayers[index];

      if (trajectoryPlayer) {
        trajectoryPlayer.getPositionAt(currentTime, vec);
      } else {
        vec.setScalar(0);
      }

      if (lightProgramPlayer) {
        lightProgramPlayer.evaluateColorAt(currentTime, colorArray);
        color.fromArray(colorArray);
      } else {
        color.setScalar(0.5);
      }

      updateEntityPositionAndColor(entity, vec, color);
      if (showLabels) {
        rotateEntityLabelTowards(entity, this._cameraPosition, this.data);
      }
    }
  },

  update(oldData) {
    const oldDroneSize = oldData.droneSize || 0;
    const oldSize = oldData.size || 0;
    const oldShowLabels = Boolean(oldData.showLabels);
    const oldScaleLabels = Boolean(oldData.scaleLabels);
    const { droneSize, scaleLabels, showLabels, size, type } = this.data;

    // TODO: support changing types on the fly

    if (size > oldSize) {
      // Add new drones
      for (let i = oldSize; i < size; i++) {
        const entity = this.system.createNewUAVEntity({
          type,
          droneSize,
          label: String(i + 1),
          showLabel: showLabels,
        });
        this.el.append(entity);

        this._drones.push({ index: i, entity });
      }
    } else {
      // Remove unneeded drones
      for (let i = size; i < oldSize; i++) {
        const { entity } = this._drones.pop();
        entity.remove();
      }
    }

    if (oldDroneSize !== droneSize) {
      // Update drone sizes
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateEntitySize(entity, droneSize);
      }
    }

    if (oldShowLabels !== showLabels) {
      // Update label visibility
      for (const item of this._drones) {
        const { entity } = item;
        this.system.updateLabelVisibility(entity, showLabels);
      }
    }

    if (oldScaleLabels !== scaleLabels && !scaleLabels) {
      // Reset the scale of each label
      for (const item of this._drones) {
        const { entity } = item;
        this.system.resetLabelScale(entity);
      }
    }
  },
});
