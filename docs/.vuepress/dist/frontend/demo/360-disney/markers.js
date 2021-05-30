/*!
* Photo Sphere Viewer 4.0.0-SNAPSHOT
* @copyright 2014-2015 Jérémy Heleine
* @copyright 2015-2020 Damien "Mistic" Sorel
* @licence MIT (https://opensource.org/licenses/MIT)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('photo-sphere-viewer'), require('three')) :
  typeof define === 'function' && define.amd ? define(['photo-sphere-viewer', 'three'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.PhotoSphereViewer = global.PhotoSphereViewer || {}, global.PhotoSphereViewer.MarkersPlugin = factory(global.PhotoSphereViewer, global.THREE)));
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
   * Returns intermediary point between two points on the sphere
   * {@link http://www.movable-type.co.uk/scripts/latlong.html}
   * @param {number[]} p1
   * @param {number[]} p2
   * @param {number} f
   * @returns {number[]}
   * @private
   */

  function greatArcIntermediaryPoint(p1, p2, f) {
    var λ1 = p1[0],
        φ1 = p1[1];
    var λ2 = p2[0],
        φ2 = p2[1];
    var r = photoSphereViewer.utils.greatArcDistance(p1, p2) * photoSphereViewer.CONSTANTS.SPHERE_RADIUS;
    var a = Math.sin((1 - f) * r) / Math.sin(r / photoSphereViewer.CONSTANTS.SPHERE_RADIUS);
    var b = Math.sin(f * r) / Math.sin(r);
    var x = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
    var y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
    var z = a * Math.sin(φ1) + b * Math.sin(φ2);
    return [Math.atan2(y, x), Math.atan2(z, Math.sqrt(x * x + y * y))];
  }
  /**
   * @summary Computes the center point of a polygon
   * @todo Get "visual center" (https://blog.mapbox.com/a-new-algorithm-for-finding-a-visual-center-of-a-polygon-7c77e6492fbc)
   * @param {number[][]} polygon
   * @returns {number[]}
   * @private
   */

  function getPolygonCenter(polygon) {
    var sum = polygon.reduce(function (intermediary, point) {
      return [intermediary[0] + point[0], intermediary[1] + point[1]];
    });
    return [sum[0] / polygon.length, sum[1] / polygon.length];
  }
  /**
   * @summary Computes the middle point of a polyline
   * @param {number[][]} polyline
   * @returns {number[]}
   * @private
   */

  function getPolylineCenter(polyline) {
    // compute each segment length + total length
    var length = 0;
    var lengths = [];

    for (var i = 0; i < polyline.length - 1; i++) {
      var l = photoSphereViewer.utils.greatArcDistance(polyline[i], polyline[i + 1]) * photoSphereViewer.CONSTANTS.SPHERE_RADIUS;
      lengths.push(l);
      length += l;
    } // iterate until length / 2


    var consumed = 0;

    for (var _i = 0; _i < polyline.length - 1; _i++) {
      // once the segment containing the middle point is found, computes the intermediary point
      if (consumed + lengths[_i] > length / 2) {
        var r = (length / 2 - consumed) / lengths[_i];
        return greatArcIntermediaryPoint(polyline[_i], polyline[_i + 1], r);
      }

      consumed += lengths[_i];
    } // this never happens


    return polyline[Math.round(polyline.length / 2)];
  }

  /**
   * @summary Types of marker
   * @memberOf PSV.plugins.MarkersPlugin
   * @enum {string}
   * @constant
   * @private
   */

  var MARKER_TYPES = {
    image: 'image',
    html: 'html',
    polygonPx: 'polygonPx',
    polygonRad: 'polygonRad',
    polylinePx: 'polylinePx',
    polylineRad: 'polylineRad',
    square: 'square',
    rect: 'rect',
    circle: 'circle',
    ellipse: 'ellipse',
    path: 'path'
  };
  /**
   * @typedef {Object} PSV.plugins.MarkersPlugin.Properties
   * @summary Marker properties, see {@link http://photo-sphere-viewer.js.org/plugins/plugin-markers.html#markers-options}
   */

  /**
   * @summary Object representing a marker
   * @memberOf PSV.plugins.MarkersPlugin
   */

  var Marker = /*#__PURE__*/function () {
    /**
     * @param {PSV.plugins.MarkersPlugin.Properties} properties
     * @param {PSV.Viewer} psv
     * @throws {PSV.PSVError} when the configuration is incorrect
     */
    function Marker(properties, psv) {
      if (!properties.id) {
        throw new photoSphereViewer.PSVError('missing marker id');
      }

      if (properties.image && (!properties.width || !properties.height)) {
        throw new photoSphereViewer.PSVError('missing marker width/height');
      }

      if (properties.image || properties.html) {
        if ((!('x' in properties) || !('y' in properties)) && (!('latitude' in properties) || !('longitude' in properties))) {
          throw new photoSphereViewer.PSVError('missing marker position, latitude/longitude or x/y');
        }
      }
      /**
       * @member {PSV.Viewer}
       * @readonly
       * @protected
       */


      this.psv = psv;
      /**
       * @member {string}
       * @readonly
       */

      this.id = properties.id;
      /**
       * @member {string}
       * @readonly
       */

      this.type = Marker.getType(properties, false);
      /**
       * @member {boolean}
       * @protected
       */

      this.visible = true;
      /**
       * @member {HTMLElement|SVGElement}
       * @readonly
       */

      this.$el = null;
      /**
       * @summary Original configuration of the marker
       * @member {PSV.plugins.MarkersPlugin.Properties}
       * @readonly
       */

      this.config = {};
      /**
       * @summary User data associated to the marker
       * @member {any}
       */

      this.data = undefined;
      /**
       * @summary Tooltip instance for this marker
       * @member {PSV.components.Tooltip}
       */

      this.tooltip = null;
      /**
       * @summary Computed properties
       * @member {Object}
       * @protected
       * @property {boolean} inViewport
       * @property {boolean} dynamicSize
       * @property {PSV.Point} anchor
       * @property {PSV.Position} position - position in spherical coordinates
       * @property {PSV.Point} position2D - position in viewer coordinates
       * @property {external:THREE.Vector3[]} positions3D - positions in 3D space
       * @property {number} width
       * @property {number} height
       * @property {*} def
       */

      this.props = {
        inViewport: false,
        dynamicSize: false,
        anchor: null,
        position: null,
        position2D: null,
        positions3D: null,
        width: null,
        height: null,
        def: null
      }; // create element

      if (this.isNormal()) {
        this.$el = document.createElement('div');
      } else if (this.isPolygon()) {
        this.$el = document.createElementNS(MarkersPlugin.SVG_NS, 'polygon');
      } else if (this.isPolyline()) {
        this.$el = document.createElementNS(MarkersPlugin.SVG_NS, 'polyline');
      } else {
        this.$el = document.createElementNS(MarkersPlugin.SVG_NS, this.type);
      }

      this.$el.id = "psv-marker-" + this.id;
      this.$el[MarkersPlugin.MARKER_DATA] = this;
      this.update(properties);
    }
    /**
     * @summary Destroys the marker
     */


    var _proto = Marker.prototype;

    _proto.destroy = function destroy() {
      delete this.$el[MarkersPlugin.MARKER_DATA];
      delete this.$el;
      delete this.config;
      delete this.props;
      delete this.psv;
    }
    /**
     * @summary Checks if it is a normal marker (image or html)
     * @returns {boolean}
     */
    ;

    _proto.isNormal = function isNormal() {
      return this.type === MARKER_TYPES.image || this.type === MARKER_TYPES.html;
    }
    /**
     * @summary Checks if it is a polygon/polyline marker
     * @returns {boolean}
     */
    ;

    _proto.isPoly = function isPoly() {
      return this.isPolygon() || this.isPolyline();
    }
    /**
     * @summary Checks if it is a polygon/polyline using pixel coordinates
     * @returns {boolean}
     */
    ;

    _proto.isPolyPx = function isPolyPx() {
      return this.type === MARKER_TYPES.polygonPx || this.type === MARKER_TYPES.polylinePx;
    }
    /**
     * @summary Checks if it is a polygon/polyline using radian coordinates
     * @returns {boolean}
     */
    ;

    _proto.isPolyRad = function isPolyRad() {
      return this.type === MARKER_TYPES.polygonRad || this.type === MARKER_TYPES.polylineRad;
    }
    /**
     * @summary Checks if it is a polygon marker
     * @returns {boolean}
     */
    ;

    _proto.isPolygon = function isPolygon() {
      return this.type === MARKER_TYPES.polygonPx || this.type === MARKER_TYPES.polygonRad;
    }
    /**
     * @summary Checks if it is a polyline marker
     * @returns {boolean}
     */
    ;

    _proto.isPolyline = function isPolyline() {
      return this.type === MARKER_TYPES.polylinePx || this.type === MARKER_TYPES.polylineRad;
    }
    /**
     * @summary Checks if it is an SVG marker
     * @returns {boolean}
     */
    ;

    _proto.isSvg = function isSvg() {
      return this.type === MARKER_TYPES.square || this.type === MARKER_TYPES.rect || this.type === MARKER_TYPES.circle || this.type === MARKER_TYPES.ellipse || this.type === MARKER_TYPES.path;
    }
    /**
     * @summary Computes marker scale from zoom level
     * @param {number} zoomLevel
     * @returns {number}
     */
    ;

    _proto.getScale = function getScale(zoomLevel) {
      if (Array.isArray(this.config.scale)) {
        return this.config.scale[0] + (this.config.scale[1] - this.config.scale[0]) * photoSphereViewer.CONSTANTS.EASINGS.inQuad(zoomLevel / 100);
      } else if (typeof this.config.scale === 'function') {
        return this.config.scale(zoomLevel);
      } else if (typeof this.config.scale === 'number') {
        return this.config.scale * photoSphereViewer.CONSTANTS.EASINGS.inQuad(zoomLevel / 100);
      } else {
        return 1;
      }
    }
    /**
     * @summary Returns the markers list content for the marker, it can be either :
     * - the `listContent`
     * - the `tooltip.content`
     * - the `html`
     * - the `id`
     * @returns {*}
     */
    ;

    _proto.getListContent = function getListContent() {
      if (this.config.listContent) {
        return this.config.listContent;
      } else if (this.config.tooltip) {
        return this.config.tooltip.content;
      } else if (this.config.html) {
        return this.config.html;
      } else {
        return this.id;
      }
    }
    /**
     * @summary Display the tooltip of this marker
     * @param {{clientX: number, clientY: number}} [mousePosition]
     */
    ;

    _proto.showTooltip = function showTooltip(mousePosition) {
      if (this.visible && this.config.tooltip && this.props.position2D) {
        var config = {
          content: this.config.tooltip.content,
          position: this.config.tooltip.position,
          data: this
        };

        if (this.isPoly()) {
          var boundingRect = this.psv.container.getBoundingClientRect();
          config.box = {
            // separate the tooltip from the cursor
            width: this.psv.tooltip.size.arrow * 2,
            height: this.psv.tooltip.size.arrow * 2
          };

          if (mousePosition) {
            config.top = mousePosition.clientY - boundingRect.top - this.psv.tooltip.size.arrow / 2;
            config.left = mousePosition.clientX - boundingRect.left - this.psv.tooltip.size.arrow;
          } else {
            config.top = this.props.position2D.y;
            config.left = this.props.position2D.x;
          }
        } else {
          config.top = this.props.position2D.y;
          config.left = this.props.position2D.x;
          config.box = {
            width: this.props.width,
            height: this.props.height
          };
        }

        if (this.tooltip) {
          this.tooltip.move(config);
        } else {
          this.tooltip = this.psv.tooltip.create(config);
        }
      }
    }
    /**
     * @summary Hides the tooltip of this marker
     */
    ;

    _proto.hideTooltip = function hideTooltip() {
      if (this.tooltip) {
        this.tooltip.hide();
        this.tooltip = null;
      }
    }
    /**
     * @summary Updates the marker with new properties
     * @param {PSV.plugins.MarkersPlugin.Properties} properties
     * @throws {PSV.PSVError} when trying to change the marker's type
     */
    ;

    _proto.update = function update(properties) {
      var newType = Marker.getType(properties, true);

      if (newType !== undefined && newType !== this.type) {
        throw new photoSphereViewer.PSVError('cannot change marker type');
      }

      photoSphereViewer.utils.deepmerge(this.config, properties);
      this.data = this.config.data;
      this.visible = properties.visible !== false; // reset CSS class

      if (this.isNormal()) {
        this.$el.setAttribute('class', 'psv-marker psv-marker--normal');
      } else {
        this.$el.setAttribute('class', 'psv-marker psv-marker--svg');
      } // add CSS classes


      if (this.config.className) {
        photoSphereViewer.utils.addClasses(this.$el, this.config.className);
      }

      if (this.config.tooltip) {
        photoSphereViewer.utils.addClasses(this.$el, 'psv-marker--has-tooltip');

        if (typeof this.config.tooltip === 'string') {
          this.config.tooltip = {
            content: this.config.tooltip
          };
        }
      }

      if (this.config.content) {
        photoSphereViewer.utils.addClasses(this.$el, 'psv-marler--has-content');
      } // apply style


      if (this.config.style) {
        photoSphereViewer.utils.deepmerge(this.$el.style, this.config.style);
      } // parse anchor


      this.props.anchor = photoSphereViewer.utils.parsePosition(this.config.anchor);

      if (this.isNormal()) {
        this.__updateNormal();
      } else if (this.isPoly()) {
        this.__updatePoly();
      } else {
        this.__updateSvg();
      }
    }
    /**
     * @summary Updates a normal marker
     * @private
     */
    ;

    _proto.__updateNormal = function __updateNormal() {
      if (this.config.width && this.config.height) {
        this.props.dynamicSize = false;
        this.props.width = this.config.width;
        this.props.height = this.config.height;
        this.$el.style.width = this.config.width + 'px';
        this.$el.style.height = this.config.height + 'px';
      } else {
        this.props.dynamicSize = true;
      }

      if (this.config.image) {
        this.props.def = this.config.image;
        this.$el.style.backgroundImage = "url(" + this.config.image + ")";
      } else if (this.config.html) {
        this.props.def = this.config.html;
        this.$el.innerHTML = this.config.html;
      } // set anchor


      this.$el.style.transformOrigin = this.props.anchor.x * 100 + "% " + this.props.anchor.y * 100 + "%"; // convert texture coordinates to spherical coordinates

      this.props.position = this.psv.dataHelper.cleanPosition(this.config); // compute x/y/z position

      this.props.positions3D = [this.psv.dataHelper.sphericalCoordsToVector3(this.props.position)];
    }
    /**
     * @summary Updates an SVG marker
     * @private
     */
    ;

    _proto.__updateSvg = function __updateSvg() {
      var _this = this;

      this.props.dynamicSize = true; // set content

      switch (this.type) {
        case MARKER_TYPES.square:
          this.props.def = {
            x: 0,
            y: 0,
            width: this.config.square,
            height: this.config.square
          };
          break;

        case MARKER_TYPES.rect:
          if (Array.isArray(this.config.rect)) {
            this.props.def = {
              x: 0,
              y: 0,
              width: this.config.rect[0],
              height: this.config.rect[1]
            };
          } else {
            this.props.def = {
              x: 0,
              y: 0,
              width: this.config.rect.width,
              height: this.config.rect.height
            };
          }

          break;

        case MARKER_TYPES.circle:
          this.props.def = {
            cx: this.config.circle,
            cy: this.config.circle,
            r: this.config.circle
          };
          break;

        case MARKER_TYPES.ellipse:
          if (Array.isArray(this.config.ellipse)) {
            this.props.def = {
              cx: this.config.ellipse[0],
              cy: this.config.ellipse[1],
              rx: this.config.ellipse[0],
              ry: this.config.ellipse[1]
            };
          } else {
            this.props.def = {
              cx: this.config.ellipse.rx,
              cy: this.config.ellipse.ry,
              rx: this.config.ellipse.rx,
              ry: this.config.ellipse.ry
            };
          }

          break;

        case MARKER_TYPES.path:
          this.props.def = {
            d: this.config.path
          };
          break;
        // no default
      }

      photoSphereViewer.utils.each(this.props.def, function (value, prop) {
        _this.$el.setAttributeNS(null, prop, value);
      }); // set style

      if (this.config.svgStyle) {
        photoSphereViewer.utils.each(this.config.svgStyle, function (value, prop) {
          _this.$el.setAttributeNS(null, photoSphereViewer.utils.dasherize(prop), value);
        });
      } else {
        this.$el.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.5)');
      } // convert texture coordinates to spherical coordinates


      this.props.position = this.psv.dataHelper.cleanPosition(this.config); // compute x/y/z position

      this.props.positions3D = [this.psv.dataHelper.sphericalCoordsToVector3(this.props.position)];
    }
    /**
     * @summary Updates a polygon marker
     * @private
     */
    ;

    _proto.__updatePoly = function __updatePoly() {
      var _this2 = this;

      this.props.dynamicSize = true; // set style

      if (this.config.svgStyle) {
        photoSphereViewer.utils.each(this.config.svgStyle, function (value, prop) {
          _this2.$el.setAttributeNS(null, photoSphereViewer.utils.dasherize(prop), value);
        });

        if (this.isPolyline() && !this.config.svgStyle.fill) {
          this.$el.setAttributeNS(null, 'fill', 'none');
        }
      } else if (this.isPolygon()) {
        this.$el.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.5)');
      } else if (this.isPolyline()) {
        this.$el.setAttributeNS(null, 'fill', 'none');
        this.$el.setAttributeNS(null, 'stroke', 'rgb(0,0,0)');
      } // fold arrays: [1,2,3,4] => [[1,2],[3,4]]


      var actualPoly = this.config.polygonPx || this.config.polygonRad || this.config.polylinePx || this.config.polylineRad;

      if (!Array.isArray(actualPoly[0])) {
        for (var i = 0; i < actualPoly.length; i++) {
          actualPoly.splice(i, 2, [actualPoly[i], actualPoly[i + 1]]);
        }
      } // convert texture coordinates to spherical coordinates


      if (this.isPolyPx()) {
        this.props.def = actualPoly.map(function (coord) {
          var sphericalCoords = _this2.psv.dataHelper.textureCoordsToSphericalCoords({
            x: coord[0],
            y: coord[1]
          });

          return [sphericalCoords.longitude, sphericalCoords.latitude];
        });
      } // clean angles
      else {
          this.props.def = actualPoly.map(function (coord) {
            return [photoSphereViewer.utils.parseAngle(coord[0]), photoSphereViewer.utils.parseAngle(coord[1], true)];
          });
        }

      var centroid = this.isPolygon() ? getPolygonCenter(this.props.def) : getPolylineCenter(this.props.def);
      this.props.position = {
        longitude: centroid[0],
        latitude: centroid[1]
      }; // compute x/y/z positions

      this.props.positions3D = this.props.def.map(function (coord) {
        return _this2.psv.dataHelper.sphericalCoordsToVector3({
          longitude: coord[0],
          latitude: coord[1]
        });
      });
    }
    /**
     * @summary Determines the type of a marker by the available properties
     * @param {Marker.Properties} properties
     * @param {boolean} [allowNone=false]
     * @returns {string}
     * @throws {PSV.PSVError} when the marker's type cannot be found
     */
    ;

    Marker.getType = function getType(properties, allowNone) {
      if (allowNone === void 0) {
        allowNone = false;
      }

      var found = [];
      photoSphereViewer.utils.each(MARKER_TYPES, function (type) {
        if (type in properties) {
          found.push(type);
        }
      });

      if (found.length === 0 && !allowNone) {
        throw new photoSphereViewer.PSVError("missing marker content, either " + Object.keys(MARKER_TYPES).join(', '));
      } else if (found.length > 1) {
        throw new photoSphereViewer.PSVError("multiple marker content, either " + Object.keys(MARKER_TYPES).join(', '));
      }

      return found[0];
    };

    return Marker;
  }();

  var pin = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"10 9 81 81\"><path d=\"M50.5 90S22.9 51.9 22.9 36.6 35.2 9 50.5 9s27.6 12.4 27.6 27.6S50.5 90 50.5 90zm0-66.3c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11z\"/><!--Created by Rohith M S from the Noun Project--></svg>\n";

  /**
   * @summary Navigation bar markers button class
   * @extends PSV.buttons.AbstractButton
   * @memberof PSV.buttons
   */

  var MarkersButton = /*#__PURE__*/function (_AbstractButton) {
    _inheritsLoose(MarkersButton, _AbstractButton);

    /**
     * @param {PSV.components.Navbar} navbar
     */
    function MarkersButton(navbar) {
      var _this;

      _this = _AbstractButton.call(this, navbar, 'psv-button--hover-scale psv-markers-button', true) || this;
      /**
       * @type {PSV.plugins.MarkersPlugin}
       */

      _this.plugin = _this.psv.getPlugin(MarkersPlugin.id);

      if (_this.plugin) {
        _this.plugin.on(MarkersPlugin.EVENTS.SHOW_MARKERS, _assertThisInitialized(_this));

        _this.plugin.on(MarkersPlugin.EVENTS.HIDE_MARKERS, _assertThisInitialized(_this));

        _this.toggleActive(true);
      }

      return _this;
    }
    /**
     * @override
     */


    var _proto = MarkersButton.prototype;

    _proto.destroy = function destroy() {
      if (this.plugin) {
        this.plugin.off(MarkersPlugin.EVENTS.SHOW_MARKERS, this);
        this.plugin.off(MarkersPlugin.EVENTS.HIDE_MARKERS, this);
      }

      _AbstractButton.prototype.destroy.call(this);
    }
    /**
     * @override
     */
    ;

    _proto.isSupported = function isSupported() {
      return !!this.plugin;
    }
    /**
     * @summary Handles events
     * @param {Event} e
     * @private
     */
    ;

    _proto.handleEvent = function handleEvent(e) {
      /* eslint-disable */
      switch (e.type) {
        // @formatter:off
        case MarkersPlugin.EVENTS.SHOW_MARKERS:
          this.toggleActive(true);
          break;

        case MarkersPlugin.EVENTS.HIDE_MARKERS:
          this.toggleActive(false);
          break;
        // @formatter:on
      }
      /* eslint-enable */

    }
    /**
     * @override
     * @description Toggles markers
     */
    ;

    _proto.onClick = function onClick() {
      if (this.plugin.prop.visible) {
        this.plugin.hide();
      } else {
        this.plugin.show();
      }
    };

    return MarkersButton;
  }(photoSphereViewer.AbstractButton);
  MarkersButton.id = 'markers';
  MarkersButton.icon = pin;

  var icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"9 9 81 81\"><path fill=\"currentColor\" d=\"M37.5 90S9.9 51.9 9.9 36.6 22.2 9 37.5 9s27.6 12.4 27.6 27.6S37.5 90 37.5 90zm0-66.3c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11zM86.7 55H70c-1.8 0-3.3-1.5-3.3-3.3s1.5-3.3 3.3-3.3h16.7c1.8 0 3.3 1.5 3.3 3.3S88.5 55 86.7 55zm0-25h-15a3.3 3.3 0 0 1-3.3-3.3c0-1.8 1.5-3.3 3.3-3.3h15c1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3zM56.5 73h30c1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3h-30a3.3 3.3 0 0 1-3.3-3.3 3.2 3.2 0 0 1 3.3-3.3z\"/><!--Created by Rohith M S from the Noun Project--></svg>\n";

  /**
   * @summary Navigation bar markers list button class
   * @extends PSV.buttons.AbstractButton
   * @memberof PSV.buttons
   */

  var MarkersListButton = /*#__PURE__*/function (_AbstractButton) {
    _inheritsLoose(MarkersListButton, _AbstractButton);

    /**
     * @param {PSV.components.Navbar} navbar
     */
    function MarkersListButton(navbar) {
      var _this;

      _this = _AbstractButton.call(this, navbar, 'psv-button--hover-scale psv-markers-list-button', true) || this;
      /**
       * @type {PSV.plugins.MarkersPlugin}
       */

      _this.plugin = _this.psv.getPlugin(MarkersPlugin.id);

      if (_this.plugin) {
        _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.OPEN_PANEL, _assertThisInitialized(_this));

        _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.CLOSE_PANEL, _assertThisInitialized(_this));
      }

      _this.hide();

      return _this;
    }
    /**
     * @override
     */


    var _proto = MarkersListButton.prototype;

    _proto.destroy = function destroy() {
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.OPEN_PANEL, this);
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.CLOSE_PANEL, this);

      _AbstractButton.prototype.destroy.call(this);
    }
    /**
     * @override
     */
    ;

    _proto.isSupported = function isSupported() {
      return !!this.plugin;
    }
    /**
     * @summary Handles events
     * @param {Event} e
     * @private
     */
    ;

    _proto.handleEvent = function handleEvent(e) {
      /* eslint-disable */
      switch (e.type) {
        // @formatter:off
        case photoSphereViewer.CONSTANTS.EVENTS.OPEN_PANEL:
          this.toggleActive(e.args[0] === MarkersPlugin.ID_PANEL_MARKERS_LIST);
          break;

        case photoSphereViewer.CONSTANTS.EVENTS.CLOSE_PANEL:
          this.toggleActive(false);
          break;
        // @formatter:on
      }
      /* eslint-enable */

    }
    /**
     * @override
     * @description Toggles markers list
     */
    ;

    _proto.onClick = function onClick() {
      this.plugin.toggleMarkersList();
    };

    return MarkersListButton;
  }(photoSphereViewer.AbstractButton);
  MarkersListButton.id = 'markersList';
  MarkersListButton.icon = icon;

  /**
   * @typedef {Object} PSV.plugins.MarkersPlugin.Options
   * @property {boolean} [clickEventOnMarker=false] If a `click` event is triggered on the viewer additionally to the `select-marker` event.
   * @property {PSV.plugins.MarkersPlugin.Properties[]} [markers]
   */

  /**
   * @typedef {Object} PSV.plugins.MarkersPlugin.SelectMarkerData
   * @summary Data of the `select-marker` event
   * @property {boolean} dblclick - if the selection originated from a double click, the simple click is always fired before the double click
   * @property {boolean} rightclick - if the selection originated from a right click
   */
  // add markers buttons

  photoSphereViewer.DEFAULTS.navbar.splice(photoSphereViewer.DEFAULTS.navbar.indexOf('caption'), 0, MarkersButton.id, MarkersListButton.id);
  photoSphereViewer.DEFAULTS.lang[MarkersButton.id] = 'Markers';
  photoSphereViewer.DEFAULTS.lang[MarkersListButton.id] = 'Markers list';
  photoSphereViewer.registerButton(MarkersButton);
  photoSphereViewer.registerButton(MarkersListButton);
  /**
   * @summary Displays various markers on the viewer
   * @extends PSV.plugins.AbstractPlugin
   * @memberof PSV.plugins
   */

  var MarkersPlugin = /*#__PURE__*/function (_AbstractPlugin) {
    _inheritsLoose(MarkersPlugin, _AbstractPlugin);

    /**
     * @summary Available events
     * @enum {string}
     * @constant
     */

    /**
     * @summary Namespace for SVG creation
     * @type {string}
     * @constant
     */

    /**
     * @summary Property name added to marker elements
     * @type {string}
     * @constant
     */

    /**
     * @summary Panel identifier for marker content
     * @type {string}
     * @constant
     */

    /**
     * @summary Panel identifier for markers list
     * @type {string}
     * @constant
     */

    /**
     * @summary Markers list template
     * @param {PSV.Marker[]} markers
     * @param {string} title
     * @param {string} dataKey
     * @returns {string}
     */

    /**
     * @param {PSV.Viewer} psv
     * @param {PSV.plugins.MarkersPlugin.Options} [options]
     */
    function MarkersPlugin(psv, options) {
      var _this;

      _this = _AbstractPlugin.call(this, psv) || this;
      /**
       * @member {HTMLElement}
       * @readonly
       */

      _this.container = document.createElement('div');
      _this.container.className = 'psv-markers';
      _this.container.style.cursor = _this.psv.config.mousemove ? 'move' : 'default';

      _this.psv.container.appendChild(_this.container);
      /**
       * @summary All registered markers
       * @member {Object<string, PSV.plugins.MarkersPlugin.Marker>}
       */


      _this.markers = {};
      /**
       * @type {Object}
       * @property {boolean} visible - Visibility of the component
       * @property {PSV.plugins.MarkersPlugin.Marker} currentMarker - Last selected marker
       * @property {PSV.plugins.MarkersPlugin.Marker} hoveringMarker - Marker under the cursor
       * @private
       */

      _this.prop = {
        visible: true,
        currentMarker: null,
        hoveringMarker: null
      };
      /**
       * @type {PSV.plugins.MarkersPlugin.Options}
       */

      _this.config = _extends({
        clickEventOnMarker: false
      }, options);
      /**
       * @member {SVGElement}
       * @readonly
       */

      _this.svgContainer = document.createElementNS(MarkersPlugin.SVG_NS, 'svg');

      _this.svgContainer.setAttribute('class', 'psv-markers-svg-container');

      _this.container.appendChild(_this.svgContainer); // Markers events via delegation


      _this.container.addEventListener('mouseenter', _assertThisInitialized(_this), true);

      _this.container.addEventListener('mouseleave', _assertThisInitialized(_this), true);

      _this.container.addEventListener('mousemove', _assertThisInitialized(_this), true);

      _this.container.addEventListener('contextmenu', _assertThisInitialized(_this)); // Viewer events


      _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.CLICK, _assertThisInitialized(_this));

      _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.DOUBLE_CLICK, _assertThisInitialized(_this));

      _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.RENDER, _assertThisInitialized(_this));

      _this.psv.on(photoSphereViewer.CONSTANTS.EVENTS.CONFIG_CHANGED, _assertThisInitialized(_this));

      if (options != null && options.markers) {
        _this.psv.once(photoSphereViewer.CONSTANTS.EVENTS.READY, function () {
          _this.setMarkers(options.markers);
        });
      }

      return _this;
    }
    /**
     * @package
     */


    var _proto = MarkersPlugin.prototype;

    _proto.destroy = function destroy() {
      this.clearMarkers(false);
      this.container.removeEventListener('mouseenter', this);
      this.container.removeEventListener('mouseleave', this);
      this.container.removeEventListener('mousemove', this);
      this.container.removeEventListener('contextmenu', this);
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.CLICK, this);
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.DOUBLE_CLICK, this);
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.RENDER, this);
      this.psv.off(photoSphereViewer.CONSTANTS.EVENTS.CONFIG_CHANGED, this);
      this.psv.container.removeChild(this.container);
      delete this.svgContainer;
      delete this.markers;
      delete this.container;
      delete this.prop;

      _AbstractPlugin.prototype.destroy.call(this);
    }
    /**
     * @summary Handles events
     * @param {Event} e
     * @private
     */
    ;

    _proto.handleEvent = function handleEvent(e) {
      /* eslint-disable */
      switch (e.type) {
        // @formatter:off
        case 'mouseenter':
          this.__onMouseEnter(e);

          break;

        case 'mouseleave':
          this.__onMouseLeave(e);

          break;

        case 'mousemove':
          this.__onMouseMove(e);

          break;

        case 'contextmenu':
          this.__onContextMenu(e);

          break;

        case photoSphereViewer.CONSTANTS.EVENTS.CLICK:
          this.__onClick(e, e.args[0], false);

          break;

        case photoSphereViewer.CONSTANTS.EVENTS.DOUBLE_CLICK:
          this.__onClick(e, e.args[0], true);

          break;

        case photoSphereViewer.CONSTANTS.EVENTS.RENDER:
          this.renderMarkers();
          break;

        case photoSphereViewer.CONSTANTS.EVENTS.CONFIG_CHANGED:
          this.container.style.cursor = this.psv.config.mousemove ? 'move' : 'default';
          break;
        // @formatter:on
      }
      /* eslint-enable */

    }
    /**
     * @override
     * @fires PSV.plugins.MarkersPlugin.show-markers
     */
    ;

    _proto.show = function show() {
      this.prop.visible = true;
      this.renderMarkers();
      /**
       * @event show-markers
       * @memberof PSV.plugins.MarkersPlugin
       * @summary Triggered when the markers are shown
       */

      this.trigger(MarkersPlugin.EVENTS.SHOW_MARKERS);
    }
    /**
     * @override
     * @fires PSV.plugins.MarkersPlugin.hide-markers
     */
    ;

    _proto.hide = function hide() {
      this.prop.visible = false;
      this.renderMarkers();
      /**
       * @event hide-markers
       * @memberof PSV.plugins.MarkersPlugin
       * @summary Triggered when the markers are hidden
       */

      this.trigger(MarkersPlugin.EVENTS.HIDE_MARKERS);
    }
    /**
     * @summary Toggles the visibility of all tooltips
     */
    ;

    _proto.toggleAllTooltips = function toggleAllTooltips() {
      this.prop.showAllTooltips = !this.prop.showAllTooltips;
      this.renderMarkers();
    }
    /**
     * @summary Displays all tooltips
     */
    ;

    _proto.showAllTooltips = function showAllTooltips() {
      this.prop.showAllTooltips = true;
      this.renderMarkers();
    }
    /**
     * @summary Hides all tooltips
     */
    ;

    _proto.hideAllTooltips = function hideAllTooltips() {
      this.prop.showAllTooltips = false;
      this.renderMarkers();
    }
    /**
     * @summary Return the total number of markers
     * @returns {number}
     */
    ;

    _proto.getNbMarkers = function getNbMarkers() {
      return Object.keys(this.markers).length;
    }
    /**
     * @summary Adds a new marker to viewer
     * @param {PSV.plugins.MarkersPlugin.Properties} properties
     * @param {boolean} [render=true] - renders the marker immediately
     * @returns {PSV.plugins.MarkersPlugin.Marker}
     * @throws {PSV.PSVError} when the marker's id is missing or already exists
     */
    ;

    _proto.addMarker = function addMarker(properties, render) {
      if (render === void 0) {
        render = true;
      }

      if (this.markers[properties.id]) {
        throw new photoSphereViewer.PSVError("marker \"" + properties.id + "\" already exists");
      }

      var marker = new Marker(properties, this.psv);

      if (marker.isNormal()) {
        this.container.appendChild(marker.$el);
      } else {
        this.svgContainer.appendChild(marker.$el);
      }

      this.markers[marker.id] = marker;

      if (render) {
        this.renderMarkers();

        this.__refreshUi();
      }

      return marker;
    }
    /**
     * @summary Returns the internal marker object for a marker id
     * @param {string} markerId
     * @returns {PSV.plugins.MarkersPlugin.Marker}
     * @throws {PSV.PSVError} when the marker cannot be found
     */
    ;

    _proto.getMarker = function getMarker(markerId) {
      var id = typeof markerId === 'object' ? markerId.id : markerId;

      if (!this.markers[id]) {
        throw new photoSphereViewer.PSVError("cannot find marker \"" + id + "\"");
      }

      return this.markers[id];
    }
    /**
     * @summary Returns the last marker selected by the user
     * @returns {PSV.plugins.MarkersPlugin.Marker}
     */
    ;

    _proto.getCurrentMarker = function getCurrentMarker() {
      return this.prop.currentMarker;
    }
    /**
     * @summary Updates the existing marker with the same id
     * @description Every property can be changed but you can't change its type (Eg: `image` to `html`).
     * @param {PSV.plugins.MarkersPlugin.Properties} properties
     * @param {boolean} [render=true] - renders the marker immediately
     * @returns {PSV.plugins.MarkersPlugin.Marker}
     */
    ;

    _proto.updateMarker = function updateMarker(properties, render) {
      if (render === void 0) {
        render = true;
      }

      var marker = this.getMarker(properties.id);
      marker.update(properties);

      if (render) {
        this.renderMarkers();

        this.__refreshUi();
      }

      return marker;
    }
    /**
     * @summary Removes a marker from the viewer
     * @param {*} markerOrId
     * @param {boolean} [render=true] - renders the marker immediately
     */
    ;

    _proto.removeMarker = function removeMarker(markerOrId, render) {
      if (render === void 0) {
        render = true;
      }

      var marker = this.getMarker(markerOrId);

      if (marker.isNormal()) {
        this.container.removeChild(marker.$el);
      } else {
        this.svgContainer.removeChild(marker.$el);
      }

      if (this.prop.hoveringMarker === marker) {
        this.prop.hoveringMarker = null;
      }

      if (this.prop.currentMarker === marker) {
        this.prop.currentMarker = null;
      }

      marker.hideTooltip();
      marker.destroy();
      delete this.markers[marker.id];

      if (render) {
        this.__refreshUi();
      }
    }
    /**
     * @summary Replaces all markers
     * @param {PSV.plugins.MarkersPlugin.Properties[]} markers
     * @param {boolean} [render=true] - renders the marker immediately
     */
    ;

    _proto.setMarkers = function setMarkers(markers, render) {
      var _this2 = this;

      if (render === void 0) {
        render = true;
      }

      this.clearMarkers(false);
      photoSphereViewer.utils.each(markers, function (marker) {
        return _this2.addMarker(marker, false);
      });

      if (render) {
        this.renderMarkers();

        this.__refreshUi();
      }
    }
    /**
     * @summary Removes all markers
     * @param {boolean} [render=true] - renders the markers immediately
     */
    ;

    _proto.clearMarkers = function clearMarkers(render) {
      var _this3 = this;

      if (render === void 0) {
        render = true;
      }

      photoSphereViewer.utils.each(this.markers, function (marker) {
        return _this3.removeMarker(marker, false);
      });

      if (render) {
        this.renderMarkers();

        this.__refreshUi();
      }
    }
    /**
     * @summary Rotate the view to face the marker
     * @param {string} markerId
     * @param {string|number} [speed] - rotates smoothy, see {@link PSV.Viewer#animate}
     * @fires PSV.plugins.MarkersPlugin.goto-marker-done
     * @return {PSV.Animation}  A promise that will be resolved when the animation finishes
     */
    ;

    _proto.gotoMarker = function gotoMarker(markerId, speed) {
      var _this4 = this;

      var marker = this.getMarker(markerId);
      return this.psv.animate(_extends({}, marker.props.position, {
        speed: speed
      })).then(function () {
        /**
         * @event goto-marker-done
         * @memberof PSV.plugins.MarkersPlugin
         * @summary Triggered when the animation to a marker is done
         * @param {PSV.plugins.MarkersPlugin.Marker} marker
         */
        _this4.trigger(MarkersPlugin.EVENTS.GOTO_MARKER_DONE, marker);
      });
    }
    /**
     * @summary Hides a marker
     * @param {string} markerId
     */
    ;

    _proto.hideMarker = function hideMarker(markerId) {
      this.getMarker(markerId).visible = false;
      this.renderMarkers();
    }
    /**
     * @summary Shows a marker
     * @param {string} markerId
     */
    ;

    _proto.showMarker = function showMarker(markerId) {
      this.getMarker(markerId).visible = true;
      this.renderMarkers();
    }
    /**
     * @summary Toggles a marker
     * @param {string} markerId
     */
    ;

    _proto.toggleMarker = function toggleMarker(markerId) {
      this.getMarker(markerId).visible ^= true;
      this.renderMarkers();
    }
    /**
     * @summary Toggles the visibility of markers list
     */
    ;

    _proto.toggleMarkersList = function toggleMarkersList() {
      if (this.psv.panel.prop.contentId === MarkersPlugin.ID_PANEL_MARKERS_LIST) {
        this.hideMarkersList();
      } else {
        this.showMarkersList();
      }
    }
    /**
     * @summary Opens the panel with the content of the marker
     * @param {string} markerId
     */
    ;

    _proto.showMarkerPanel = function showMarkerPanel(markerId) {
      var _marker$config;

      var marker = this.getMarker(markerId);

      if (marker != null && (_marker$config = marker.config) != null && _marker$config.content) {
        this.psv.panel.show({
          id: MarkersPlugin.ID_PANEL_MARKER,
          content: marker.config.content
        });
      } else {
        this.psv.panel.hide(MarkersPlugin.ID_PANEL_MARKER);
      }
    }
    /**
     * @summary Opens side panel with list of markers
     * @fires PSV.plugins.MarkersPlugin.filter:render-markers-list
     */
    ;

    _proto.showMarkersList = function showMarkersList() {
      var _this5 = this;

      var markers = [];
      photoSphereViewer.utils.each(this.markers, function (marker) {
        if (marker.visible && !marker.config.hideList) {
          markers.push(marker);
        }
      });
      /**
       * @event filter:render-markers-list
       * @memberof PSV.plugins.MarkersPlugin
       * @summary Used to alter the list of markers displayed on the side-panel
       * @param {PSV.plugins.MarkersPlugin.Marker[]} markers
       * @returns {PSV.plugins.MarkersPlugin.Marker[]}
       */

      markers = this.change(MarkersPlugin.EVENTS.RENDER_MARKERS_LIST, markers);
      this.psv.panel.show({
        id: MarkersPlugin.ID_PANEL_MARKERS_LIST,
        content: MarkersPlugin.MARKERS_LIST_TEMPLATE(markers, this.psv.config.lang.markers, photoSphereViewer.utils.dasherize(MarkersPlugin.MARKER_DATA)),
        noMargin: true,
        clickHandler: function clickHandler(e) {
          var li = e.target ? photoSphereViewer.utils.getClosest(e.target, 'li') : undefined;
          var markerId = li ? li.dataset[MarkersPlugin.MARKER_DATA] : undefined;

          if (markerId) {
            var marker = _this5.getMarker(markerId);
            /**
             * @event select-marker-list
             * @memberof PSV.plugins.MarkersPlugin
             * @summary Triggered when a marker is selected from the side panel
             * @param {PSV.plugins.MarkersPlugin.Marker} marker
             */


            _this5.trigger(MarkersPlugin.EVENTS.SELECT_MARKER_LIST, marker);

            _this5.gotoMarker(marker, 1000);

            _this5.hideMarkersList();
          }
        }
      });
    }
    /**
     * @summary Closes side panel if it contains the list of markers
     */
    ;

    _proto.hideMarkersList = function hideMarkersList() {
      this.psv.panel.hide(MarkersPlugin.ID_PANEL_MARKERS_LIST);
    }
    /**
     * @summary Updates the visibility and the position of all markers
     */
    ;

    _proto.renderMarkers = function renderMarkers() {
      var _this6 = this;

      photoSphereViewer.utils.each(this.markers, function (marker) {
        var isVisible = _this6.prop.visible && marker.visible;

        if (isVisible && marker.isPoly()) {
          var positions = _this6.__getPolyPositions(marker);

          isVisible = positions.length > (marker.isPolygon() ? 2 : 1);

          if (isVisible) {
            marker.props.position2D = _this6.__getMarkerPosition(marker);
            var points = positions.map(function (pos) {
              return pos.x + ',' + pos.y;
            }).join(' ');
            marker.$el.setAttributeNS(null, 'points', points);
          }
        } else if (isVisible) {
          if (marker.props.dynamicSize) {
            _this6.__updateMarkerSize(marker);
          }

          var scale = marker.getScale(_this6.psv.getZoomLevel());

          var position = _this6.__getMarkerPosition(marker, scale);

          isVisible = _this6.__isMarkerVisible(marker, position);

          if (isVisible) {
            marker.props.position2D = position;

            if (marker.isSvg()) {
              var transform = "translate(" + position.x + ", " + position.y + ")";

              if (scale !== 1) {
                transform += " scale(" + scale + ", " + scale + ")";
              }

              marker.$el.setAttributeNS(null, 'transform', transform);
            } else {
              var _transform = "translate3D(" + position.x + "px, " + position.y + "px, 0px)";

              if (scale !== 1) {
                _transform += " scale(" + scale + ", " + scale + ")";
              }

              marker.$el.style.transform = _transform;
            }
          }
        }

        marker.props.inViewport = isVisible;
        photoSphereViewer.utils.toggleClass(marker.$el, 'psv-marker--visible', isVisible);

        if (marker.props.inViewport && (_this6.prop.showAllTooltips || marker === _this6.prop.hoveringMarker && !marker.isPoly())) {
          marker.showTooltip();
        } else if (!marker.props.inViewport || marker !== _this6.prop.hoveringMarker) {
          marker.hideTooltip();
        }
      });
    }
    /**
     * @summary Determines if a point marker is visible<br>
     * It tests if the point is in the general direction of the camera, then check if it's in the viewport
     * @param {PSV.plugins.MarkersPlugin.Marker} marker
     * @param {PSV.Point} position
     * @returns {boolean}
     * @private
     */
    ;

    _proto.__isMarkerVisible = function __isMarkerVisible(marker, position) {
      return marker.props.positions3D[0].dot(this.psv.prop.direction) > 0 && position.x + marker.props.width >= 0 && position.x - marker.props.width <= this.psv.prop.size.width && position.y + marker.props.height >= 0 && position.y - marker.props.height <= this.psv.prop.size.height;
    }
    /**
     * @summary Computes the real size of a marker
     * @description This is done by removing all it's transformations (if any) and making it visible
     * before querying its bounding rect
     * @param {PSV.plugins.MarkersPlugin.Marker} marker
     * @private
     */
    ;

    _proto.__updateMarkerSize = function __updateMarkerSize(marker) {
      photoSphereViewer.utils.addClasses(marker.$el, 'psv-marker--transparent');
      var transform;

      if (marker.isSvg()) {
        transform = marker.$el.getAttributeNS(null, 'transform');
        marker.$el.removeAttributeNS(null, 'transform');
      } else {
        transform = marker.$el.style.transform;
        marker.$el.style.transform = '';
      }

      var rect = marker.$el.getBoundingClientRect();
      marker.props.width = rect.width;
      marker.props.height = rect.height;
      photoSphereViewer.utils.removeClasses(marker.$el, 'psv-marker--transparent');

      if (transform) {
        if (marker.isSvg()) {
          marker.$el.setAttributeNS(null, 'transform', transform);
        } else {
          marker.$el.style.transform = transform;
        }
      } // the size is no longer dynamic once known


      marker.props.dynamicSize = false;
    }
    /**
     * @summary Computes viewer coordinates of a marker
     * @param {PSV.plugins.MarkersPlugin.Marker} marker
     * @param {number} [scale=1]
     * @returns {PSV.Point}
     * @private
     */
    ;

    _proto.__getMarkerPosition = function __getMarkerPosition(marker, scale) {
      if (scale === void 0) {
        scale = 1;
      }

      if (marker.isPoly()) {
        return this.psv.dataHelper.vector3ToViewerCoords(this.psv.dataHelper.sphericalCoordsToVector3(marker.props.position));
      } else {
        var position = this.psv.dataHelper.vector3ToViewerCoords(marker.props.positions3D[0]);
        position.x -= marker.props.width * marker.props.anchor.x * scale;
        position.y -= marker.props.height * marker.props.anchor.y * scale;
        return position;
      }
    }
    /**
     * @summary Computes viewer coordinates of each point of a polygon/polyline<br>
     * It handles points behind the camera by creating intermediary points suitable for the projector
     * @param {PSV.plugins.MarkersPlugin.Marker} marker
     * @returns {PSV.Point[]}
     * @private
     */
    ;

    _proto.__getPolyPositions = function __getPolyPositions(marker) {
      var _this7 = this;

      var nbVectors = marker.props.positions3D.length; // compute if each vector is visible

      var positions3D = marker.props.positions3D.map(function (vector) {
        return {
          vector: vector,
          visible: vector.dot(_this7.psv.prop.direction) > 0
        };
      }); // get pairs of visible/invisible vectors for each invisible vector connected to a visible vector

      var toBeComputed = [];
      positions3D.forEach(function (pos, i) {
        if (!pos.visible) {
          var neighbours = [i === 0 ? positions3D[nbVectors - 1] : positions3D[i - 1], i === nbVectors - 1 ? positions3D[0] : positions3D[i + 1]];
          neighbours.forEach(function (neighbour) {
            if (neighbour.visible) {
              toBeComputed.push({
                visible: neighbour,
                invisible: pos,
                index: i
              });
            }
          });
        }
      }); // compute intermediary vector for each pair (the loop is reversed for splice to insert at the right place)

      toBeComputed.reverse().forEach(function (pair) {
        positions3D.splice(pair.index, 0, {
          vector: _this7.__getPolyIntermediaryPoint(pair.visible.vector, pair.invisible.vector),
          visible: true
        });
      }); // translate vectors to screen pos

      return positions3D.filter(function (pos) {
        return pos.visible;
      }).map(function (pos) {
        return _this7.psv.dataHelper.vector3ToViewerCoords(pos.vector);
      });
    }
    /**
     * Given one point in the same direction of the camera and one point behind the camera,
     * computes an intermediary point on the great circle delimiting the half sphere visible by the camera.
     * The point is shifted by .01 rad because the projector cannot handle points exactly on this circle.
     * TODO : does not work with fisheye view (must not use the great circle)
     * {@link http://math.stackexchange.com/a/1730410/327208}
     * @param P1 {external:THREE.Vector3}
     * @param P2 {external:THREE.Vector3}
     * @returns {external:THREE.Vector3}
     * @private
     */
    ;

    _proto.__getPolyIntermediaryPoint = function __getPolyIntermediaryPoint(P1, P2) {
      var C = this.psv.prop.direction.clone().normalize();
      var N = new THREE.Vector3().crossVectors(P1, P2).normalize();
      var V = new THREE.Vector3().crossVectors(N, P1).normalize();
      var X = P1.clone().multiplyScalar(-C.dot(V));
      var Y = V.clone().multiplyScalar(C.dot(P1));
      var H = new THREE.Vector3().addVectors(X, Y).normalize();
      var a = new THREE.Vector3().crossVectors(H, C);
      return H.applyAxisAngle(a, 0.01).multiplyScalar(photoSphereViewer.CONSTANTS.SPHERE_RADIUS);
    }
    /**
     * @summary Returns the marker associated to an event target
     * @param {EventTarget} target
     * @param {boolean} [closest=false]
     * @returns {PSV.plugins.MarkersPlugin.Marker}
     * @private
     */
    ;

    _proto.__getTargetMarker = function __getTargetMarker(target, closest) {
      if (closest === void 0) {
        closest = false;
      }

      var target2 = closest ? photoSphereViewer.utils.getClosest(target, '.psv-marker') : target;
      return target2 ? target2[MarkersPlugin.MARKER_DATA] : undefined;
    }
    /**
     * @summary Checks if an event target is in the tooltip
     * @param {EventTarget} target
     * @param {PSV.components.Tooltip} tooltip
     * @returns {boolean}
     * @private
     */
    ;

    _proto.__targetOnTooltip = function __targetOnTooltip(target, tooltip) {
      return target && tooltip ? photoSphereViewer.utils.hasParent(target, tooltip.container) : false;
    }
    /**
     * @summary Handles mouse enter events, show the tooltip for non polygon markers
     * @param {MouseEvent} e
     * @fires PSV.plugins.MarkersPlugin.over-marker
     * @private
     */
    ;

    _proto.__onMouseEnter = function __onMouseEnter(e) {
      var marker = this.__getTargetMarker(e.target);

      if (marker && !marker.isPoly()) {
        this.prop.hoveringMarker = marker;
        /**
         * @event over-marker
         * @memberof PSV.plugins.MarkersPlugin
         * @summary Triggered when the user puts the cursor hover a marker
         * @param {PSV.plugins.MarkersPlugin.Marker} marker
         */

        this.trigger(MarkersPlugin.EVENTS.OVER_MARKER, marker);

        if (!this.prop.showAllTooltips) {
          marker.showTooltip(e);
        }
      }
    }
    /**
     * @summary Handles mouse leave events, hide the tooltip
     * @param {MouseEvent} e
     * @fires PSV.plugins.MarkersPlugin.leave-marker
     * @private
     */
    ;

    _proto.__onMouseLeave = function __onMouseLeave(e) {
      var marker = this.__getTargetMarker(e.target); // do not hide if we enter the tooltip itself while hovering a polygon


      if (marker && !(marker.isPoly() && this.__targetOnTooltip(e.relatedTarget, marker.tooltip))) {
        /**
         * @event leave-marker
         * @memberof PSV.plugins.MarkersPlugin
         * @summary Triggered when the user puts the cursor away from a marker
         * @param {PSV.plugins.MarkersPlugin.Marker} marker
         */
        this.trigger(MarkersPlugin.EVENTS.LEAVE_MARKER, marker);
        this.prop.hoveringMarker = null;

        if (!this.prop.showAllTooltips) {
          marker.hideTooltip();
        }
      }
    }
    /**
     * @summary Handles mouse move events, refreshUi the tooltip for polygon markers
     * @param {MouseEvent} e
     * @fires PSV.plugins.MarkersPlugin.leave-marker
     * @fires PSV.plugins.MarkersPlugin.over-marker
     * @private
     */
    ;

    _proto.__onMouseMove = function __onMouseMove(e) {
      var _this$prop$hoveringMa;

      var marker;

      var targetMarker = this.__getTargetMarker(e.target);

      if (targetMarker != null && targetMarker.isPoly()) {
        marker = targetMarker;
      } // do not hide if we enter the tooltip itself while hovering a polygon
      else if (this.prop.hoveringMarker && this.__targetOnTooltip(e.target, this.prop.hoveringMarker.tooltip)) {
          marker = this.prop.hoveringMarker;
        }

      if (marker) {
        if (!this.prop.hoveringMarker) {
          this.trigger(MarkersPlugin.EVENTS.OVER_MARKER, marker);
          this.prop.hoveringMarker = marker;
        }

        if (!this.prop.showAllTooltips) {
          marker.showTooltip(e);
        }
      } else if ((_this$prop$hoveringMa = this.prop.hoveringMarker) != null && _this$prop$hoveringMa.isPoly()) {
        this.trigger(MarkersPlugin.EVENTS.LEAVE_MARKER, this.prop.hoveringMarker);

        if (!this.prop.showAllTooltips) {
          this.prop.hoveringMarker.hideTooltip();
        }

        this.prop.hoveringMarker = null;
      }
    }
    /**
     * @summary Handles context menu events
     * @param {MouseWheelEvent} evt
     * @private
     */
    ;

    _proto.__onContextMenu = function __onContextMenu(evt) {
      if (!photoSphereViewer.utils.getClosest(evt.target, '.psv-marker')) {
        return true;
      }

      evt.preventDefault();
      return false;
    }
    /**
     * @summary Handles mouse click events, select the marker and open the panel if necessary
     * @param {Event} e
     * @param {Object} data
     * @param {boolean} dblclick
     * @fires PSV.plugins.MarkersPlugin.select-marker
     * @fires PSV.plugins.MarkersPlugin.unselect-marker
     * @private
     */
    ;

    _proto.__onClick = function __onClick(e, data, dblclick) {
      var marker = this.__getTargetMarker(data.target, true);

      if (marker) {
        this.prop.currentMarker = marker;
        /**
         * @event select-marker
         * @memberof PSV.plugins.MarkersPlugin
         * @summary Triggered when the user clicks on a marker. The marker can be retrieved from outside the event handler
         * with {@link PSV.plugins.MarkersPlugin.getCurrentMarker}
         * @param {PSV.plugins.MarkersPlugin.Marker} marker
         * @param {PSV.plugins.MarkersPlugin.SelectMarkerData} data
         */

        this.trigger(MarkersPlugin.EVENTS.SELECT_MARKER, marker, {
          dblclick: dblclick,
          rightclick: data.rightclick
        });

        if (this.config.clickEventOnMarker) {
          // add the marker to event data
          data.marker = marker;
        } else {
          e.stopPropagation();
        } // the marker could have been deleted in an event handler


        if (this.markers[marker.id]) {
          this.showMarkerPanel(marker.id);
        }
      } else if (this.prop.currentMarker) {
        /**
         * @event unselect-marker
         * @memberof PSV.plugins.MarkersPlugin
         * @summary Triggered when a marker was selected and the user clicks elsewhere
         * @param {PSV.plugins.MarkersPlugin.Marker} marker
         */
        this.trigger(MarkersPlugin.EVENTS.UNSELECT_MARKER, this.prop.currentMarker);
        this.psv.panel.hide(MarkersPlugin.ID_PANEL_MARKER);
        this.prop.currentMarker = null;
      }
    }
    /**
     * @summary Updates the visiblity of the panel and the buttons
     * @private
     */
    ;

    _proto.__refreshUi = function __refreshUi() {
      var nbMarkers = this.getNbMarkers();
      var markersButton = this.psv.navbar.getButton(MarkersButton.id, false);
      var markersListButton = this.psv.navbar.getButton(MarkersListButton.id, false);

      if (nbMarkers === 0) {
        markersButton == null ? void 0 : markersButton.hide();
        markersListButton == null ? void 0 : markersListButton.hide();

        if (this.psv.panel.isVisible(MarkersPlugin.ID_PANEL_MARKERS_LIST)) {
          this.psv.panel.hide();
        } else if (this.psv.panel.isVisible(MarkersPlugin.ID_PANEL_MARKER)) {
          this.psv.panel.hide();
        }
      } else {
        markersButton == null ? void 0 : markersButton.show();
        markersListButton == null ? void 0 : markersListButton.show();

        if (this.psv.panel.isVisible(MarkersPlugin.ID_PANEL_MARKERS_LIST)) {
          this.showMarkersList();
        } else if (this.psv.panel.isVisible(MarkersPlugin.ID_PANEL_MARKER)) {
          this.prop.currentMarker ? this.showMarkerPanel(this.prop.currentMarker) : this.psv.panel.hide();
        }
      }
    };

    return MarkersPlugin;
  }(photoSphereViewer.AbstractPlugin);

  MarkersPlugin.id = 'markers';
  MarkersPlugin.EVENTS = {
    GOTO_MARKER_DONE: 'goto-marker-done',
    LEAVE_MARKER: 'leave-marker',
    OVER_MARKER: 'over-marker',
    RENDER_MARKERS_LIST: 'render-markers-list',
    SELECT_MARKER: 'select-marker',
    SELECT_MARKER_LIST: 'select-marker-list',
    UNSELECT_MARKER: 'unselect-marker',
    HIDE_MARKERS: 'hide-markers',
    SHOW_MARKERS: 'show-markers'
  };
  MarkersPlugin.SVG_NS = 'http://www.w3.org/2000/svg';
  MarkersPlugin.MARKER_DATA = 'psvMarker';
  MarkersPlugin.ID_PANEL_MARKER = 'marker';
  MarkersPlugin.ID_PANEL_MARKERS_LIST = 'markersList';

  MarkersPlugin.MARKERS_LIST_TEMPLATE = function (markers, title, dataKey) {
    return "\n<div class=\"psv-markers-list-container\">\n  <h1 class=\"psv-markers-list-title\">" + icon + " " + title + "</h1>\n  <ul class=\"psv-markers-list\">\n    " + markers.map(function (marker) {
      return "\n    <li data-" + dataKey + "=\"" + marker.config.id + "\" class=\"psv-markers-list-item " + (marker.config.className || '') + "\">\n      " + (marker.type === 'image' ? "<img class=\"psv-markers-list-image\" src=\"" + marker.config.image + "\"/>" : '') + "\n      <p class=\"psv-markers-list-name\">" + marker.getListContent() + "</p>\n    </li>\n    ";
    }).join('') + "\n  </ul>\n</div>\n";
  };

  return MarkersPlugin;

})));
//# sourceMappingURL=markers.js.map
