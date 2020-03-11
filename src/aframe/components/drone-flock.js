/**
 * A-Frame component that implements the logic needed to implement a
 * "drone flock" entity consisting of multiple drones backed by a `Flock`
 * instance.
 */

import watch from 'redux-watch';

import AFrame from '../aframe';

import { getElapsedSecondsGetter } from '~/features/playback/selectors';
import { getTrajectoryPlayers } from '~/features/show/selectors';
import store from '~/store';

const { THREE } = AFrame;

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
  },

  createNewUAVEntity() {
    const el = document.createElement('a-entity');
    el.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.5,
      segmentsHeight: 9,
      segmentsWidth: 18
    });
    el.setAttribute('material', {
      color: new THREE.Color('#0088ff'),
      fog: false,
      shader: 'flat'
    });
    el.setAttribute('position', '0 0 0');

    const glowEl = document.createElement('a-entity');
    glowEl.setAttribute('sprite', {
      blending: 'additive',
      color: new THREE.Color('#ff8800'),
      scale: '2 2 1',
      src: '#glow-texture',
      transparent: true
    });

    el.append(glowEl);

    return el;
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
      mesh.material.color.setHex(color);
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
        glowMesh.material.color.setHex(color);
      }
    }
  }
});

AFrame.registerComponent('drone-flock', {
  schema: {
    size: { default: 0 }
  },

  init() {
    this._drones = [];
    this._vec = new THREE.Vector3();

    const boundGetTrajectoryPlayers = () =>
      getTrajectoryPlayers(store.getState());
    store.subscribe(
      watch(boundGetTrajectoryPlayers)(trajectoryPlayers => {
        this._trajectoryPlayers = trajectoryPlayers;
      })
    );

    this._trajectoryPlayers = boundGetTrajectoryPlayers();
  },

  remove() {},

  tick() {
    const { currentTime, updateEntityPositionAndColor } = this.system;
    const vec = this._vec;

    for (const item of this._drones) {
      const { entity, index } = item;

      const trajectoryPlayer = this._trajectoryPlayers[index];

      if (trajectoryPlayer) {
        trajectoryPlayer.getPositionAt(currentTime, vec);
      } else {
        vec.setScalar(0);
      }

      updateEntityPositionAndColor(entity, vec, 0xffffff);
    }
  },

  update(oldData) {
    const oldSize = oldData.size;

    if (oldSize !== undefined) {
      const { size } = this.data;

      if (size > oldSize) {
        // Add new drones
        for (let i = oldSize; i < size; i++) {
          const entity = this.system.createNewUAVEntity();
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
  }
});
