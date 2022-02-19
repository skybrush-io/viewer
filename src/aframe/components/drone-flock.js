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
  const glowEntity = entity.childNodes[0];
  return glowEntity ? glowEntity.getObject3D('mesh') : undefined;
}

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

    this._entityFactories = {
      default: this._createDefaultUAVEntity.bind(this),
      flapper: this._createFlapperDroneEntity.bind(this),
    };
  },

  createNewUAVEntity(type, droneSize) {
    const factory =
      this._entityFactories[type] || this._entityFactories.default;
    return factory(droneSize);
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

    element.append(this._createGlowEntity(droneSize));

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
});

AFrame.registerComponent('drone-flock', {
  schema: {
    droneSize: { default: 1 },
    size: { default: 0 },
    type: { default: 'default' },
  },

  init() {
    this._drones = [];

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
    const { currentTime, updateEntityPositionAndColor } = this.system;
    const vec = this._vec;
    const color = this._color;
    const colorArray = this._colorArray;

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
    }
  },

  update(oldData) {
    const oldDroneSize = oldData.droneSize || 0;
    const oldSize = oldData.size || 0;
    const { droneSize, size, type } = this.data;

    // TODO: support changing types on the fly

    if (size > oldSize) {
      // Add new drones
      for (let i = oldSize; i < size; i++) {
        const entity = this.system.createNewUAVEntity(type, droneSize);
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
  },
});
