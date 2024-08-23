/**
 * A-Frame component that implements the logic needed to implement a
 * "drone flock" entity consisting of multiple drones backed by a `Flock`
 * instance.
 */

import watch from 'redux-watch';
import AFrame from '@skybrush/aframe-components';

import { INDOOR_DRONE_SIZE_SCALING_FACTOR } from '~/constants';
import { getElapsedSecondsGetter } from '~/features/playback/selectors';
import {
  getLightProgramPlayers,
  getTrajectoryPlayers,
  getYawControlPlayers,
} from '~/features/show/selectors';
import store from '~/store';

import fontUrl from '~/../assets/fonts/Roboto-msdf.json';
import fontImageUrl from '~/../assets/fonts/Roboto-msdf.png';

const { THREE } = AFrame;

const defaultGeometry = {
  primitive: 'sphere',
  radius: 1,
  segmentsHeight: 9,
  segmentsWidth: 18,
};

function getGlowMeshFromEntity(entity) {
  // We assume that the glow is the second child
  const glowEntity = entity.childNodes[1];
  return glowEntity ? glowEntity.getObject3D('mesh') : undefined;
}

function getLabelFromEntity(entity) {
  // We assume that the label is the first child
  return entity.childNodes[0];
}

function getYawMarkerFromEntity(entity) {
  // We assume that the yaw marker is the third child
  return entity.childNodes[2];
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

    this.currentTime = 0;
    this._getElapsedSeconds = boundGetElapsedSecodsGetter();
    this._vec = new THREE.Vector3();

    this._entityFactories = {
      default: this._createDefaultUAVEntity.bind(this),
      flapper: this._createFlapperDroneEntity.bind(this),
    };

    this.rotateEntityLabelTowards = this.rotateEntityLabelTowards.bind(this);
  },

  createNewUAVEntity({
    type,
    indoor,
    droneSize,
    label,
    labelColor,
    showGlow,
    showLabel,
    showYaw,
  }) {
    const factory =
      this._entityFactories[type] || this._entityFactories.default;
    const element = factory(droneSize);

    element.append(
      this._createLabelEntity(label, showLabel, labelColor, indoor)
    );
    element.append(this._createGlowEntity(droneSize, showGlow));
    element.append(this._createYawIndicatorEntity(droneSize, showYaw));

    return element;
  },

  _createGlowEntity(droneSize = 1, showGlow = true) {
    const glowElement = document.createElement('a-entity');
    glowElement.setAttribute('sprite', {
      blending: 'additive',
      color: new THREE.Color('#ff8800'),
      scale: `${droneSize * 4} ${droneSize * 4} 1`,
      src: '#glow-texture',
      transparent: true,
      visible: showGlow,
    });
    return glowElement;
  },

  _createLabelEntity(label, visible, color = 'white', indoor = false) {
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

    /* Y coordinate is slightly offset from zero to prevent Z-fighting with the
     * glow sprite */
    const scalingFactor = indoor ? INDOOR_DRONE_SIZE_SCALING_FACTOR : 1;
    const labelScale = DEFAULT_LABEL_SCALE * scalingFactor;
    const labelOffset = DEFAULT_LABEL_OFFSET * scalingFactor;
    labelElement.setAttribute('position', `0 -0.05 ${labelOffset}`);
    labelElement.setAttribute('rotation', '0 -90 -90');
    labelElement.setAttribute(
      'scale',
      `${labelScale} ${labelScale} ${labelScale}`
    );
    labelElement.setAttribute('visible', visible ? 'true' : 'false');

    return labelElement;
  },

  _createYawIndicatorEntity(droneSize = 1, showYaw = false) {
    const yawElement = document.createElement('a-entity');

    const cylinder = document.createElement('a-entity');
    cylinder.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: droneSize / 10,
      height: droneSize,
    });
    cylinder.setAttribute('position', `${droneSize * 1.2} 0 0`);
    cylinder.setAttribute('material', {
      color: new THREE.Color('#ff0000'),
      shader: 'flat',
    });
    cylinder.setAttribute('rotation', '0 0 90');

    yawElement.append(cylinder);
    yawElement.setAttribute('visible', showYaw ? 'true' : 'false');

    return yawElement;
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

  resetLabelScaleAndPosition(entity, indoor = false) {
    const label = getLabelFromEntity(entity);
    if (label) {
      const scalingFactor = indoor ? INDOOR_DRONE_SIZE_SCALING_FACTOR : 1;
      const labelScale = DEFAULT_LABEL_SCALE * scalingFactor;
      const labelOffset = DEFAULT_LABEL_OFFSET * scalingFactor;

      label.object3D.position.set(0, -0.05, labelOffset);
      label.object3D.scale.set(labelScale, labelScale, labelScale);
    }
  },

  rotateEntityLabelTowards(entity, position, data) {
    const { droneSize, scaleLabels } = data;
    const label = getLabelFromEntity(entity);
    const indoor = Boolean(data.indoor ?? false);
    const scalingFactor = indoor ? INDOOR_DRONE_SIZE_SCALING_FACTOR : 1;

    if (label) {
      if (scaleLabels) {
        entity.object3D.getWorldPosition(this._vec);
        const distance = this._vec.distanceTo(position);
        const scale = (distance * scalingFactor) / (20 * droneSize);
        label.object3D.scale.set(scale, scale, scale);
        label.object3D.position.z = scalingFactor + scale * (droneSize / 8);
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

    // TODO: Change the color of the yaw marker when the base color is red?
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

  updateYawRotation(entity, rotation) {
    const yaw = getYawMarkerFromEntity(entity);
    if (yaw) {
      /* Angle has to be inverted because Skybrush yaw angles increase in
       * clockwise order */
      yaw.object3D.rotation.z = -rotation.z;
    }
  },

  updateYawVisibility(entity, visible) {
    const yaw = getYawMarkerFromEntity(entity);
    if (yaw) {
      yaw.object3D.visible = visible;
    }
  },
});

AFrame.registerComponent('drone-flock', {
  schema: {
    droneSize: { default: 1 },
    indoor: { default: false },
    labelColor: { default: 'white' },
    scaleLabels: { default: false },
    showGlow: { default: true },
    showLabels: { default: false },
    showYaw: { default: false },
    size: { default: 0 },
    type: { default: 'default' },
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
      updateYawRotation,
    } = this.system;
    const vec = this._vec;
    const rot = this._rot;
    const color = this._color;
    const colorArray = this._colorArray;
    const camera = this.el.sceneEl.camera;
    const showLabels = this.data.showLabels;
    const showYaw = this.data.showYaw;

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

      if (showLabels) {
        rotateEntityLabelTowards(entity, this._cameraPosition, this.data);
      }

      if (showYaw) {
        updateYawRotation(entity, rot);
      }
    }
  },

  /* eslint-disable complexity */
  update(oldData) {
    const oldDroneSize = oldData.droneSize || 0;
    const oldSize = oldData.size || 0;
    const oldIndoor = Boolean(oldData.indoor ?? false);
    const oldShowGlow = Boolean(oldData.showGlow ?? true);
    const oldShowLabels = Boolean(oldData.showLabels);
    const oldShowYaw = Boolean(oldData.showYaw ?? false); // or no default?
    const oldScaleLabels = Boolean(oldData.scaleLabels);
    const oldLabelColor = oldData.labelColor ?? '#888';
    const {
      droneSize,
      indoor,
      labelColor,
      scaleLabels,
      showGlow,
      showLabels,
      showYaw,
      size,
      type,
    } = this.data;

    // TODO: support changing types on the fly

    if (size > oldSize) {
      // Add new drones
      for (let i = oldSize; i < size; i++) {
        const entity = this.system.createNewUAVEntity({
          type,
          droneSize,
          indoor,
          label: String(i + 1),
          labelColor,
          showGlow,
          showLabel: showLabels,
          showYaw,
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
        this.system.updateYawVisibility(entity, showYaw);
      }
    }

    if (
      oldIndoor !== indoor ||
      (oldScaleLabels !== scaleLabels && !scaleLabels)
    ) {
      // Reset the scale and position of each label
      for (const item of this._drones) {
        const { entity } = item;
        this.system.resetLabelScaleAndPosition(entity, indoor);
      }
    }
  },
  /* eslint-enable complexity */
});
