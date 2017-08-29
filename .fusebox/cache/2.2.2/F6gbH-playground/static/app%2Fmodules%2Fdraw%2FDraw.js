module.exports = { contents: "\"use strict\";\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar sodiumjs_1 = require(\"sodiumjs\");\r\nvar SelfDisposingContainer_1 = require(\"../../../lib/display/SelfDisposingContainer\");\r\nvar Draw_Assets_1 = require(\"./Draw_Assets\");\r\nvar Draw_Render_1 = require(\"./Draw_Render\");\r\nvar Draw_Touch_1 = require(\"./Draw_Touch\");\r\nvar Draw_Brush_1 = require(\"./Draw_Brush\");\r\nvar Main_1 = require(\"../../main/Main\");\r\nvar Draw = (function (_super) {\r\n    __extends(Draw, _super);\r\n    function Draw() {\r\n        var _this = _super.call(this) || this;\r\n        var unlisteners = new Array();\r\n        var assets = new Draw_Assets_1.Assets();\r\n        var sLoad = assets.load();\r\n        unlisteners.push(sLoad.listen(function (b) {\r\n            sodiumjs_1.Transaction.run(function () {\r\n                var brush = new Draw_Brush_1.Brush(assets.getTexture());\r\n                var renderLayer = new Draw_Render_1.CanvasRender(brush, new PIXI.Rectangle(0, 0, Main_1.CanvasWidth, Main_1.CanvasHeight)); //the canvas itself is very mutable\r\n                var touchManager = new Draw_Touch_1.CanvasTouch(renderLayer); //so touch processing and \"state\" is dealt with separately\r\n                _this.addChild(renderLayer);\r\n                //unlisteners.push(touchManager.sStart.listen(p => console.log(\"start\", p)), touchManager.sMove.listen(p => console.log(\"move\", p)),touchManager.sEnd.listen(p => console.log(\"end\", p)));\r\n                unlisteners.push(touchManager.sStart.listen(function (point) { return renderLayer.drawBegin(point); }), touchManager.sMove.listen(function (move) { return renderLayer.drawUpdate(move.p1, move.p2); }), touchManager.sEnd.listen(function (point) { return renderLayer.drawEnd(point); }));\r\n                _this._dispose = function () {\r\n                    unlisteners.forEach(function (unlistener) { return unlistener(); });\r\n                    touchManager.dispose();\r\n                };\r\n            });\r\n        }));\r\n        return _this;\r\n    }\r\n    Draw.prototype.dispose = function () {\r\n        this._dispose();\r\n    };\r\n    return Draw;\r\n}(SelfDisposingContainer_1.SelfDisposingContainer));\r\nexports.Draw = Draw;\r\n//# sourceMappingURL=Draw.js.map",
dependencies: ["sodiumjs","../../../lib/display/SelfDisposingContainer","./Draw_Assets","./Draw_Render","./Draw_Touch","./Draw_Brush","../../main/Main"],
sourceMap: "{\"version\":3,\"file\":\"app/modules/draw/Draw.js\",\"sourceRoot\":\"\",\"sources\":[\"/src/app/modules/draw/Draw.ts\"],\"names\":[],\"mappings\":\";;;;;;;;;;;;AAAA,qCAA6F;AAC7F,sFAAqF;AACrF,6CAAuC;AACvC,6CAA6C;AAC7C,2CAA2C;AAC3C,2CAAqC;AAErC,wCAA4D;AAO5D;IAA0B,wBAAsB;IAG5C;QAAA,YACI,iBAAO,SA8BV;QA7BG,IAAM,WAAW,GAAG,IAAI,KAAK,EAAc,CAAC;QAC5C,IAAM,MAAM,GAAG,IAAI,oBAAM,EAAE,CAAC;QAE5B,IAAM,KAAK,GAAG,MAAM,CAAC,IAAI,EAAE,CAAC;QAE5B,WAAW,CAAC,IAAI,CAAC,KAAK,CAAC,MAAM,CAAC,UAAA,CAAC;YAC3B,sBAAW,CAAC,GAAG,CAAC;gBACZ,IAAM,KAAK,GAAG,IAAI,kBAAK,CAAC,MAAM,CAAC,UAAU,EAAE,CAAC,CAAC;gBAC7C,IAAM,WAAW,GAAG,IAAI,0BAAY,CAAC,KAAK,EAAE,IAAI,IAAI,CAAC,SAAS,CAAC,CAAC,EAAC,CAAC,EAAC,kBAAW,EAAE,mBAAY,CAAC,CAAC,CAAC,CAAC,mCAAmC;gBACnI,IAAM,YAAY,GAAG,IAAI,wBAAW,CAAC,WAAW,CAAC,CAAC,CAAC,0DAA0D;gBAE7G,KAAI,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAC;gBAE3B,0LAA0L;gBAE1L,WAAW,CAAC,IAAI,CACZ,YAAY,CAAC,MAAM,CAAC,MAAM,CAAC,UAAA,KAAK,IAAI,OAAA,WAAW,CAAC,SAAS,CAAC,KAAK,CAAC,EAA5B,CAA4B,CAAC,EACjE,YAAY,CAAC,KAAK,CAAC,MAAM,CAAC,UAAA,IAAI,IAAI,OAAA,WAAW,CAAC,UAAU,CAAC,IAAI,CAAC,EAAE,EAAE,IAAI,CAAC,EAAE,CAAC,EAAxC,CAAwC,CAAC,EAC3E,YAAY,CAAC,IAAI,CAAC,MAAM,CAAC,UAAA,KAAK,IAAI,OAAA,WAAW,CAAC,OAAO,CAAC,KAAK,CAAC,EAA1B,CAA0B,CAAC,CAChE,CAAC;gBAEF,KAAI,CAAC,QAAQ,GAAG;oBACZ,WAAW,CAAC,OAAO,CAAC,UAAA,UAAU,IAAI,OAAA,UAAU,EAAE,EAAZ,CAAY,CAAC,CAAC;oBAChD,YAAY,CAAC,OAAO,EAAE,CAAC;gBAC3B,CAAC,CAAA;YACL,CAAC,CAAC,CAAC;QACP,CAAC,CAAC,CAAC,CAAC;;IAGR,CAAC;IAED,sBAAO,GAAP;QACI,IAAI,CAAC,QAAQ,EAAE,CAAC;IACpB,CAAC;IACL,WAAC;AAAD,CAAC,AAvCD,CAA0B,+CAAsB,GAuC/C;AAvCY,oBAAI\"}",
headerContent: undefined,
mtime: 1504029030253,
devLibsRequired : undefined
};