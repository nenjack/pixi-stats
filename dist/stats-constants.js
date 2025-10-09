"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOM_ELEMENT_ID = exports.GRAPH_HEIGHT = exports.GRAPH_WIDTH = exports.GRAPH_Y = exports.FONT_SIZE = exports.GRAPH_X = exports.TEXT_Y = exports.TEXT_X = exports.HEIGHT = exports.WIDTH = exports.PR = void 0;
exports.PR = 4;
exports.WIDTH = 50 * exports.PR;
exports.HEIGHT = 30 * exports.PR;
exports.TEXT_X = 7;
exports.TEXT_Y = 7;
exports.GRAPH_X = exports.TEXT_X;
exports.FONT_SIZE = 20; // tested @ 120.0 FPS (120~120)
exports.GRAPH_Y = exports.FONT_SIZE + exports.TEXT_Y;
exports.GRAPH_WIDTH = exports.WIDTH - exports.GRAPH_X * 2;
exports.GRAPH_HEIGHT = exports.HEIGHT - exports.GRAPH_X - exports.GRAPH_Y;
exports.DOM_ELEMENT_ID = 'stats';
//# sourceMappingURL=stats-constants.js.map