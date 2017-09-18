const path = require('path');
const express = require('express');

const bundleType = process.env.BUNDLE_TYPE;
const projectName = "playground";
const IsProduction = (bundleType === "production");
const outputName = IsProduction ? "$name.min.js" : "$name.js";

const { FuseBox, QuantumPlugin} = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    output: `dist/${outputName}`,
    target: "browser",
    sourceMaps: !IsProduction, // && { inline: false },
    plugins : [
        IsProduction && 
        QuantumPlugin({
            bakeApiIntoBundle : projectName,
            treeshake: true,
            uglify: true,
            target: "browser"
        })
    ],
    shim: {
        ramda: {
            exports: "R",
        },
   }
});

const bundle = fuse.bundle(projectName);

console.log("-----------" + bundleType + " --------");

if(bundleType === "test") {
    bundle.test("tests/TestInit.test.ts");
} else {
    bundle.instructions(`>app/AppInit.ts`);
}

if(bundleType === "live") {
    fuse.dev({ root: false, open: true }, server => {
        const static = path.resolve("./static");
        const dist = path.resolve("./dist");
        const app = server.httpServer.app;
        app.get("/playground.js", function(req, res) {
            res.sendFile(path.join(dist, "playground.js"));
        });
        app.get("/playground.map.js", function(req, res) {
            res.sendFile(path.join(dist, "playground.map.js"));
        });
        app.get("/", function(req, res) {
            res.sendFile(path.join(static, "index-dev.html"));
        });

        app.use(express.static(static));
    });

    bundle.watch();
}


    
fuse.run();