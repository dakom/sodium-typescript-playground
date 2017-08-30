/* 
 * Imports
 */
const path = require('path');
const express = require('express');
const { FuseBox, QuantumPlugin, WebIndexPlugin } = require("fuse-box");

/*
 * Config
 */

const projectName = "sodium-playground";
const devPageTitle = "Sodium Typescript Playground";
const sourceMapStyle = { inline: false };

/*
 * No need to adjust anything below this line
 */

console.log("-----------" + process.env.BUNDLE_TYPE + " --------");


const fuse = FuseBox.init({
    homeDir: "src",
    output: getOutputName(),
    sourceMaps: getSourceMaps(),
    plugins: getPlugins(),
    shim: getShim(),
});

const bundle = fuse.bundle(projectName);

setInstructions();

runFuse();

/*
 * Helper functions for config getters
 */

function getOutputName() {
    return (process.env.BUNDLE_TYPE !== "production") ? `dist/$name.js` : `dist/$name.min.js`;
}
function getSourceMaps() {
    return (process.env.BUNDLE_TYPE === "production") ? undefined : sourceMapStyle;
}

function getPlugins() {
    const plugins = [
        WebIndexPlugin({
            title: devPageTitle,
            template: "src/html-templates/index.html",
            path: "."
        })
    ];

    switch (process.env.BUNDLE_TYPE) {
        case "production":
            plugins.push(
                QuantumPlugin({
                    bakeApiIntoBundle: projectName,
                    treeshake: true,
                    uglify: true,
                    target: "universal"
                })
            );
    }

    return plugins;
}

function getShim() {
    if (process.env.BUNDLE_TYPE !== "test") {
        return ({
            ramda: {
                exports: "R",
            }
        })
    }
}

/*
 * Helper functions for config setters (must be called after fuse and bundle are created)
 */

function setInstructions() {
    if (process.env.BUNDLE_TYPE !== "test") {
        bundle.instructions(`>app/AppInit.ts`);
    } else {
        bundle.test("tests/TestInit.test.ts");
    }
}

function runFuse() {
    if (process.env.BUNDLE_TYPE === "live") {
        bundle.watch();
        fuse.dev({ open: true }, server => {
            const app = server.httpServer.app;
            app.use("/static/", express.static('./static'));
        });
    }

    fuse.run();
}