module.exports = { contents: "\"use strict\";\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar sodiumjs_1 = require(\"sodiumjs\");\r\nvar Main_1 = require(\"../../main/Main\");\r\nvar CanvasTouch = (function () {\r\n    function CanvasTouch(target) {\r\n        this.target = target;\r\n        //stream sinks for dispatching local events (triggered via ui/pixi listeners)\r\n        var sTouchStart = new sodiumjs_1.StreamSink();\r\n        var sTouchMove = new sodiumjs_1.StreamSink();\r\n        var sTouchEnd = new sodiumjs_1.StreamSink();\r\n        /* UI / PIXI listeners */\r\n        //using named listeners to facilitate removal\r\n        var dispatchStart = function (evt) { return sTouchStart.send(evt); };\r\n        var dispatchMove = function (evt) { return sTouchMove.send(evt); };\r\n        var dispatchEnd = function (evt) {\r\n            sTouchEnd.send(evt);\r\n            sTouchStart.send(null); //send null to reset cDragging\r\n        };\r\n        target.on('pointerdown', dispatchStart);\r\n        function toggleGlobalListeners(flag) {\r\n            if (flag) {\r\n                Main_1.Main.app.renderer.plugins.interaction.on('pointermove', dispatchMove);\r\n                Main_1.Main.app.renderer.plugins.interaction.on('pointerup', dispatchEnd);\r\n                Main_1.Main.app.renderer.plugins.interaction.on('pointeroutside', dispatchEnd);\r\n            }\r\n            else {\r\n                Main_1.Main.app.renderer.plugins.interaction.off('pointermove', dispatchMove);\r\n                Main_1.Main.app.renderer.plugins.interaction.off('pointerup', dispatchEnd);\r\n                Main_1.Main.app.renderer.plugins.interaction.off('pointeroutside', dispatchEnd);\r\n            }\r\n        }\r\n        /* Main FRP logic */\r\n        var cDragging = sTouchStart.map(function (evt) { return evt === null ? false : true; }).hold(false);\r\n        this.sStart = pointStream(sTouchStart, false);\r\n        this.sEnd = pointStream(sTouchEnd, true);\r\n        /* This is where the magic happens. It's like this:\r\n            1. Get any start events and map it to null\r\n            2. Merge that with any move events (which are points)\r\n            3. Collect these updates into a state machine which uses a Point as state and outputs a Move (containing two points)\r\n            3a. If the updated move point (nextPoint) or state (prevPoint) are null, or if they are equal, the output is null\r\n            3b. Otherwise, the output is the Move with prevPoint and nextPoint.\r\n            3c. The next state (prevPoint of the next call) is always set to nextPoint of this call - this allows continous lines.\r\n            4. If the update is invalid (due to the event being a start or both points being identical), filter it out\r\n        */\r\n        this.sMove = this.sStart\r\n            .map(function (evt) { return null; })\r\n            .orElse(pointStream(sTouchMove, true))\r\n            .collect(null, function (nextPoint, prevPoint) { return new sodiumjs_1.Tuple2((prevPoint === null || nextPoint === null || prevPoint.equals(nextPoint))\r\n            ? null\r\n            : Object.freeze({\r\n                p1: prevPoint,\r\n                p2: nextPoint\r\n            }), nextPoint); })\r\n            .filterNotNull();\r\n        //listeners\r\n        var unlisteners = new Array();\r\n        unlisteners.push(this.sStart.listen(function () { return toggleGlobalListeners(true); }), this.sEnd.listen(function () { return toggleGlobalListeners(false); }));\r\n        //helper function to create gated/validated streams\r\n        function pointStream(s, onlyIfDragging) {\r\n            return s.snapshot(cDragging, function (evt, dragging) {\r\n                return (dragging || !onlyIfDragging) ? evt : null;\r\n            })\r\n                .filterNotNull()\r\n                .map(function (evt) { return evt.data.getLocalPosition(target, undefined, evt.data.global); }) //note - for performance increase in exchange for purity, a local cached point could be used instead of undefined in getLocalPosition()\r\n                .map(function (point) { return new PIXI.Point(point.x >> 0, point.y >> 0); }); //we're only interested in the rounded numbers\r\n        }\r\n        /* Cleanup */\r\n        this._dispose = function () {\r\n            unlisteners.forEach(function (unlistener) { return unlistener(); });\r\n            target.off('pointerdown', dispatchStart);\r\n            toggleGlobalListeners(false);\r\n        };\r\n    }\r\n    CanvasTouch.prototype.dispose = function () {\r\n        this._dispose();\r\n    };\r\n    return CanvasTouch;\r\n}());\r\nexports.CanvasTouch = CanvasTouch;\r\n//# sourceMappingURL=Draw_Touch.js.map",
dependencies: ["sodiumjs","../../main/Main"],
sourceMap: "{\"version\":3,\"file\":\"app/modules/draw/Draw_Touch.js\",\"sourceRoot\":\"\",\"sources\":[\"/src/app/modules/draw/Draw_Touch.ts\"],\"names\":[],\"mappings\":\"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\"}",
headerContent: undefined,
mtime: 1504029030253,
devLibsRequired : undefined
};