/**
 * A-Frame component that implements the logic needed to implement a
 * "drone flock" entity consisting of multiple drones backed by a `Flock`
 * instance.
 */

import watch from 'redux-watch';

import AFrame from '../aframe';

import { getElapsedSecondsGetter } from '~/features/playback/selectors';
import {
  getLightProgramPlayers,
  getTrajectoryPlayers
} from '~/features/show/selectors';
import store from '~/store';

const { THREE } = AFrame;

const toRadians = degrees => (degrees * Math.PI) / 180;

AFrame.registerSystem('drone-flock', {
  init() {
    const boundGetElapsedSecodsGetter = () =>
      getElapsedSecondsGetter(store.getState());
    store.subscribe(
      watch(boundGetElapsedSecodsGetter)(newGetter => {
        this._getElapsedSeconds = newGetter;
      })
    );

    this.currentTime = 0;
    this._getElapsedSeconds = boundGetElapsedSecodsGetter();

    this._entityFactories = {
      default: this._createDefaultUAVEntity.bind(this),
      flapper: this._createFlapperDroneEntity.bind(this)
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
      scale: `${droneSize * 2} ${droneSize * 2} 1`,
      src: '#glow-texture',
      transparent: true
    });
    return glowElement;
  },

  _createDefaultUAVEntity(droneSize) {
    const element = document.createElement('a-entity');
    element.setAttribute('geometry', {
      primitive: 'sphere',
      radius: droneSize * 0.5,
      segmentsHeight: 9,
      segmentsWidth: 18
    });
    element.setAttribute('material', {
      color: new THREE.Color('#0088ff'),
      fog: false,
      shader: 'flat'
    });
    element.setAttribute('position', '0 0 0');

    element.append(this._createGlowEntity(droneSize));

    return element;
  },

  _createFlapperDroneEntity() {
    const element = document.createElement('a-entity');
    element.setAttribute('obj-model', {
      obj: '#flapper'
    });
    element.setAttribute('material', {
      color: new THREE.Color('#0088ff'),
      fog: false,
      shader: 'flat'
    });
    element.setAttribute('position', '0 0 0');
    element.setAttribute('rotation', '90 0 0');
    element.setAttribute('scale', '6 6 6');

    /*
    setTimeout(() => {
      element.setAttribute('glow', {
        c: 0.6,
        p: 6,
        color: '#0088ff',
        scale: 1.5,
        side: 'back'
      });
    }, 1000);
    */
    element.append(this._createGlowEntity(1 / 3));

    return element;
  },

  createTrajectoryPlayerForIndex(index) {
    return this._createTrajectoryPlayerForIndex(index);
  },

  tick() {
    this.currentTime = this._getElapsedSeconds();
  },

  updateEntityPositionRotationAndColor(entity, position, rotation, color) {
    const { rotation: currentRotation } = entity.object3D;
    const alpha = 0.1;

    entity.object3D.position.copy(position);
    entity.object3D.rotation.set(
      currentRotation.x * (1 - alpha) + rotation.x * alpha,
      currentRotation.y * (1 - alpha) + rotation.y * alpha,
      currentRotation.z * (1 - alpha) + rotation.z * alpha
    );

    const mesh = entity.getObject3D('mesh');
    if (mesh) {
      mesh.material.color.copy(color);
    } else {
      // TODO(ntamas): sometimes it happens that we get here earlier than the
      // mesh is ready (it's an async process). In this case we should store
      // the color somewhere and attempt setting it again in case there will be
      // no further updates from the UAV for a while
    }

    // TODO(ntamas): this is quite complex; we probably need to encapsulate the
    // glow as a separate component so we can simplify both the cloning code and
    // this part here.
    //
    // Also, we could cache the glow material somewhere so we don't need to look
    // it up all the time.
    const glowEntity = entity.childNodes[0];
    if (glowEntity) {
      const glowMesh = glowEntity.getObject3D('mesh');
      if (glowMesh && glowMesh.material) {
        glowMesh.material.color.copy(color);
      }
    }
  }
});

AFrame.registerComponent('drone-flock', {
  schema: {
    droneSize: { default: 1 },
    size: { default: 0 },
    type: { default: 'default' }
  },

  init() {
    this._drones = [];

    this._color = new THREE.Color();
    this._colorArray = [0, 0, 0];
    this._position = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
    this._rotation = new THREE.Euler();

    const boundGetTrajectoryPlayers = () =>
      getTrajectoryPlayers(store.getState());
    store.subscribe(
      watch(boundGetTrajectoryPlayers)(lightProgramPlayers => {
        this._trajectoryPlayers = lightProgramPlayers;
      })
    );

    const boundGetLightProgramPlayers = () =>
      getLightProgramPlayers(store.getState());
    store.subscribe(
      watch(boundGetLightProgramPlayers)(lightProgramPlayers => {
        this._lightProgramPlayers = lightProgramPlayers;
      })
    );

    this._lightProgramPlayers = boundGetLightProgramPlayers();
    this._trajectoryPlayers = boundGetTrajectoryPlayers();
  },

  remove() {},

  tick() {
    const { currentTime, updateEntityPositionRotationAndColor } = this.system;
    const position = this._position;
    const velocity = this._velocity;
    const rotation = this._rotation;
    const color = this._color;
    const colorArray = this._colorArray;

    for (const item of this._drones) {
      const { entity, index } = item;

      const lightProgramPlayer = this._lightProgramPlayers[index];
      const trajectoryPlayer = this._trajectoryPlayers[index];

      if (trajectoryPlayer) {
        trajectoryPlayer.getPositionAt(currentTime, position);
        trajectoryPlayer.getVelocityAt(currentTime, velocity);

        // TODO(ntamas): this is flapper-specific, we don't need this for
        // ordinary drones
        // Pitch angle is deduced from vx, peaking at -60 degrees for 5 m/s
        velocity.clampScalar(-5, 5);

        const pitch = -12 * velocity.x;
        const roll = -12 * velocity.y;
        rotation.set(toRadians(90 + roll), 0, toRadians(pitch));
      } else {
        position.setScalar(0);
        rotation.setScalar(0);
      }

      if (lightProgramPlayer) {
        lightProgramPlayer.evaluateColorAt(currentTime, colorArray);
        color.fromArray(colorArray);
      } else {
        color.setScalar(0.5);
      }

      updateEntityPositionRotationAndColor(entity, position, rotation, color);
    }
  },

  update(oldData) {
    const oldSize = oldData.size || 0;
    const { droneSize, size, type } = this.data;

    // TODO: support changing radii or types on the fly

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
  }
});
