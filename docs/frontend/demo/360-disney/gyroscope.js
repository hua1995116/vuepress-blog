/*!
* Photo Sphere Viewer 4.0.0-SNAPSHOT
* @copyright 2014-2015 Jérémy Heleine
* @copyright 2015-2020 Damien "Mistic" Sorel
* @licence MIT (https://opensource.org/licenses/MIT)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('photo-sphere-viewer'), require('three')) :
  typeof define === 'function' && define.amd ? define(['photo-sphere-viewer', 'three'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.PhotoSphereViewer = global.PhotoSphereViewer || {}, global.PhotoSphereViewer.GyroscopePlugin = factory(global.PhotoSphereViewer, global.THREE)));
}(this, (function (photoSphereViewer, THREE) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /**
   * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
   */

  var DeviceOrientationControls = function DeviceOrientationControls(object) {
    var scope = this;
    var changeEvent = {
      type: "change"
    };
    var EPS = 0.000001;
    this.object = object;
    this.object.rotation.reorder('YXZ');
    this.enabled = true;
    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.alphaOffset = 0; // radians

    var onDeviceOrientationChangeEvent = function onDeviceOrientationChangeEvent(event) {
      scope.deviceOrientation = event;
    };

    var onScreenOrientationChangeEvent = function onScreenOrientationChangeEvent() {
      scope.screenOrientation = window.orientation || 0;
    }; // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''


    var setObjectQuaternion = function () {
      var zee = new THREE.Vector3(0, 0, 1);
      var euler = new THREE.Euler();
      var q0 = new THREE.Quaternion();
      var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

      return function (quaternion, alpha, beta, gamma, orient) {
        euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

        quaternion.setFromEuler(euler); // orient the device

        quaternion.multiply(q1); // camera looks out the back of the device, not the top

        quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
      };
    }();

    this.connect = function () {
      onScreenOrientationChangeEvent(); // run once on load
      // iOS 13+

      if (window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then(function (response) {
          if (response == 'granted') {
            window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
            window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
          }
        }).catch(function (error) {
          console.error('THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error);
        });
      } else {
        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
      window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
      scope.enabled = false;
    };

    this.update = function () {
      var lastQuaternion = new THREE.Quaternion();
      return function () {
        if (scope.enabled === false) return;
        var device = scope.deviceOrientation;

        if (device) {
          var alpha = device.alpha ? THREE.MathUtils.degToRad(device.alpha) + scope.alphaOffset : 0; // Z

          var beta = device.beta ? THREE.MathUtils.degToRad(device.beta) : 0; // X'

          var gamma = device.gamma ? THREE.MathUtils.degToRad(device.gamma) : 0; // Y''

          var orient = scope.screenOrientation ? THREE.MathUtils.degToRad(scope.screenOrientation) : 0; // O

          setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);

          if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
            lastQuaternion.copy(scope.object.quaternion);
            scope.dispatchEvent(changeEvent);
          }
        }
      };
    }();

    this.dispose = function () {
      scope.disconnect();
    };

    this.connect();
  };

  DeviceOrientationControls.prototype = Object.create(THREE.EventDispatcher.prototype);
  DeviceOrientationControls.prototype.constructor = DeviceOrientationControls;

  var compass = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M50 0a50 50 0 1 0 0 100A50 50 0 0 0 50 0zm0 88.81a38.86 38.86 0 0 1-38.81-38.8 38.86 38.86 0 0 1 38.8-38.82A38.86 38.86 0 0 1 88.82 50 38.87 38.87 0 0 1 50 88.81z\"/><path d=\"M72.07 25.9L40.25 41.06 27.92 74.12l31.82-15.18v-.01l12.32-33.03zM57.84 54.4L44.9 42.58l21.1-10.06-8.17 21.9z\"/><!--Created by iconoci from the Noun Project--></svg>\n";

  /**
   * @summary Navigation bar gyroscope button class
   * @extends PSV.buttons.AbstractButton
   * @memberof PSV.buttons
   */

  var GyroscopeButton = /*#__PURE__*/function (_AbstractButton) {
    _inheritsLoose(GyroscopeButton, _AbstractButton);

    /**
     * @param {PSV.components.Navbar} navbar
     */
    function GyroscopeButton(navbar) {
      var _this;

      _this = _AbstractButton.call(this, navbar, 'psv-button--hover-scale psv-gyroscope-button', true) || this;
      /**
       * @type {PSV.plugins.GyroscopePlugin}
       * @readonly
       * @private
       */

      _this.plugin = _this.psv.getPlugin(GyroscopePlugin.id);

      if (_this.plugin) {
        _this.plugin.on(GyroscopePlugin.EVENTS.GYROSCOPE_UPDATED, _assertThisInitialized(_this));
      }

      return _this;
    }
    /**
     * @override
     */


    var _proto = GyroscopeButton.prototype;

    _proto.destroy = function destroy() {
      if (this.plugin) {
        this.plugin.off(GyroscopePlugin.EVENTS.GYROSCOPE_UPDATED, this);
      }

      delete this.plugin;

      _AbstractButton.prototype.destroy.call(this);
    }
    /**
     * @override
     */
    ;

    _proto.isSupported = function isSupported() {
      return !this.plugin ? false : {
        initial: false,
        promise: this.plugin.prop.isSupported
      };
    }
    /**
     * @summary Handles events
     * @param {Event} e
     * @private
     */
    ;

    _proto.handleEvent = function handleEvent(e) {
      if (e.type === GyroscopePlugin.EVENTS.GYROSCOPE_UPDATED) {
        this.toggleActive(e.args[0]);
      }
    }
    /**
     * @override
     * @description Toggles gyroscope control
     */
    ;

    _proto.onClick = function onClick() {
      this.plugin.toggle();
    };

    return GyroscopeButton;
  }(photoSphereViewer.AbstractButton);
  GyroscopeButton.id = 'gyroscope';
  GyroscopeButton.icon = compass;

  /**
   * @typedef {Object} external:THREE.DeviceOrientationControls
   * @summary {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/DeviceOrientationControls.js}
   */

  /**
   * @typedef {Object} PSV.plugins.GyroscopePlugin.Options
   * @property {boolean} [absolutePosition=false] - when true the view will ignore the current direction when enabling gyroscope control
   */
  // add gyroscope button

  photoSphereViewer.DEFAULTS.navbar.splice(-1, 0, GyroscopeButton.id);
  photoSphereViewer.DEFAULTS.lang[GyroscopeButton.id] = 'Gyroscope';
  photoSphereViewer.registerButton(GyroscopeButton);
  /**
   * @summary Adds gyroscope controls on mobile devices
   * @extends PSV.plugins.AbstractPlugin
   * @memberof PSV.plugins
   */

  var GyroscopePlugin = /*#__PURE__*/function (_AbstractPlugin) {
    _inheritsLoose(GyroscopePlugin, _AbstractPlugin);

    /**
     * @summary Available events
     * @enum {string}
     * @memberof PSV.plugins.GyroscopePlugin
     * @constant
     */

    /**
     * @param {PSV.Viewer} psv
     * @param {PSV.plugins.GyroscopePlugin.Options} options
     */
    function GyroscopePlugin(psv, options) {
      var _this;

      _this = _AbstractPlugin.call(this, psv) || this;
      /**
       * @member {Object}
       * @private
       * @property {Promise<boolean>} isSupported - indicates of the gyroscope API is available
       * @property {number} alphaOffset - current alpha offset for gyroscope controls
       * @property {Function} orientationCb - update callback of the device orientation
       * @property {boolean} config_moveInertia - original config "moveInertia"
       */

      _this.prop = {
        isSupported: _this.__checkSupport(),
        alphaOffset: 0,
        orientationCb: null,
        config_moveInertia: true
      };
      /**
       * @member {PSV.plugins.GyroscopePlugin.Options}
       * @private
       */

      _this.config = _extends({
        absolutePosition: false
      }, options);
      /**
       * @member {external:THREE.DeviceOrientationControls}
       * @private
       */

      _this.controls = null;

      _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.STOP_ALL, _assertThisInitialized(_this));

      _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.BEFORE_ROTATE, _assertThisInitialized(_this));

      return _this;
    }
    /**
     * @package
     */


    var _proto = GyroscopePlugin.prototype;

    _proto.destroy = function destroy() {
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.STOP_ALL, this);
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.BEFORE_ROTATE, this);
      this.stop();
      delete this.controls;
      delete this.prop;

      _AbstractPlugin.prototype.destroy.call(this);
    }
    /**
     * @private
     */
    ;

    _proto.handleEvent = function handleEvent(e) {
      switch (e.type) {
        case photoSphereViewer.CONSTANTS.EVENTS.STOP_ALL:
          this.stop();
          break;

        case photoSphereViewer.CONSTANTS.EVENTS.BEFORE_ROTATE:
          this.__onRotate(e);

          break;
      }
    }
    /**
     * @summary Checks if the gyroscope is enabled
     * @returns {boolean}
     */
    ;

    _proto.isEnabled = function isEnabled() {
      return !!this.prop.orientationCb;
    }
    /**
     * @summary Enables the gyroscope navigation if available
     * @returns {Promise}
     * @fires PSV.plugins.GyroscopePlugin.gyroscope-updated
     * @throws {PSV.PSVError} if the gyroscope API is not available/granted
     */
    ;

    _proto.start = function start() {
      var _this2 = this;

      return this.prop.isSupported.then(function (supported) {
        if (supported) {
          return _this2.__requestPermission();
        } else {
          photoSphereViewer.utils.logWarn('gyroscope not available');
          return Promise.reject();
        }
      }).then(function (granted) {
        if (granted) {
          return Promise.resolve();
        } else {
          photoSphereViewer.utils.logWarn('gyroscope not allowed');
          return Promise.reject();
        }
      }).then(function () {
        _this2.psv.__stopAll(); // disable inertia


        _this2.prop.config_moveInertia = _this2.psv.config.moveInertia;
        _this2.psv.config.moveInertia = false;

        _this2.__configure();
        /**
         * @event gyroscope-updated
         * @memberof PSV.plugins.GyroscopePlugin
         * @summary Triggered when the gyroscope mode is enabled/disabled
         * @param {boolean} enabled
         */


        _this2.trigger(GyroscopePlugin.EVENTS.GYROSCOPE_UPDATED, true);
      });
    }
    /**
     * @summary Disables the gyroscope navigation
     * @fires PSV.plugins.GyroscopePlugin.gyroscope-updated
     */
    ;

    _proto.stop = function stop() {
      if (this.isEnabled()) {
        this.controls.disconnect();
        this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.BEFORE_RENDER, this.prop.orientationCb);
        this.prop.orientationCb = null;
        this.psv.config.moveInertia = this.prop.config_moveInertia;
        this.trigger(GyroscopePlugin.EVENTS.GYROSCOPE_UPDATED, false);
      }
    }
    /**
     * @summary Enables or disables the gyroscope navigation
     */
    ;

    _proto.toggle = function toggle() {
      if (this.isEnabled()) {
        this.stop();
      } else {
        this.start();
      }
    }
    /**
     * @summary Attaches the {@link external:THREE.DeviceOrientationControls} to the camera
     * @private
     */
    ;

    _proto.__configure = function __configure() {
      var _this3 = this;

      if (!this.controls) {
        this.controls = new DeviceOrientationControls(this.psv.renderer.camera);
      } else {
        this.controls.connect();
      } // force reset


      this.controls.deviceOrientation = null;
      this.controls.screenOrientation = 0;
      this.controls.alphaOffset = 0;
      this.prop.alphaOffset = this.config.absolutePosition ? 0 : null;

      this.prop.orientationCb = function () {
        if (!_this3.controls.deviceOrientation) {
          return;
        } // on first run compute the offset depending on the current viewer position and device orientation


        if (_this3.prop.alphaOffset === null) {
          _this3.controls.update();

          var direction = new THREE.Vector3();

          _this3.psv.renderer.camera.getWorldDirection(direction);

          var sphericalCoords = _this3.psv.dataHelper.vector3ToSphericalCoords(direction);

          _this3.prop.alphaOffset = sphericalCoords.longitude - _this3.psv.prop.position.longitude;
        } else {
          _this3.controls.alphaOffset = _this3.prop.alphaOffset;

          _this3.controls.update();

          _this3.psv.renderer.camera.getWorldDirection(_this3.psv.prop.direction);

          _this3.psv.prop.direction.multiplyScalar(photoSphereViewer.CONSTANTS.SPHERE_RADIUS);

          var _sphericalCoords = _this3.psv.dataHelper.vector3ToSphericalCoords(_this3.psv.prop.direction);

          _this3.psv.prop.position.longitude = _sphericalCoords.longitude;
          _this3.psv.prop.position.latitude = _sphericalCoords.latitude;

          _this3.psv.needsUpdate();
        }
      };

      this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.BEFORE_RENDER, this.prop.orientationCb);
    }
    /**
     * @summary Intercepts moves and offsets the alpha angle
     * @param {external:uEvent.Event} e
     * @private
     */
    ;

    _proto.__onRotate = function __onRotate(e) {
      if (this.isEnabled()) {
        e.preventDefault();
        this.prop.alphaOffset -= e.args[0].longitude - this.psv.prop.position.longitude;
      }
    }
    /**
     * @summary Detects if device orientation is supported
     * @returns {Promise<boolean>}
     * @private
     */
    ;

    _proto.__checkSupport = function __checkSupport() {
      if ('DeviceMotionEvent' in window && typeof DeviceMotionEvent.requestPermission === 'function') {
        return Promise.resolve(true);
      } else if ('DeviceOrientationEvent' in window) {
        return new Promise(function (resolve) {
          var listener = function listener(e) {
            resolve(e && e.alpha !== null && !isNaN(e.alpha));
            window.removeEventListener('deviceorientation', listener);
          };

          window.addEventListener('deviceorientation', listener, false); // after 2 secs, auto-reject the promise

          setTimeout(listener, 2000);
        });
      } else {
        return Promise.resolve(false);
      }
    }
    /**
     * @summary Request permission to the motion API
     * @returns {Promise<boolean>}
     * @private
     */
    ;

    _proto.__requestPermission = function __requestPermission() {
      if ('DeviceMotionEvent' in window && typeof DeviceMotionEvent.requestPermission === 'function') {
        return DeviceOrientationEvent.requestPermission().then(function (response) {
          return response === 'granted';
        }).catch(function () {
          return false;
        });
      } else {
        return Promise.resolve(true);
      }
    };

    return GyroscopePlugin;
  }(photoSphereViewer.AbstractPlugin);

  GyroscopePlugin.id = 'gyroscope';
  GyroscopePlugin.EVENTS = {
    GYROSCOPE_UPDATED: 'gyroscope-updated'
  };

  return GyroscopePlugin;

})));
//# sourceMappingURL=gyroscope.js.map
