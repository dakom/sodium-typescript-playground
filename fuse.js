const projectName = "playground";

const IsProduction = (process.env.NODE_ENV === "production");
const IsTest = (process.env.NODE_ENV === "test");
const outputName = IsProduction ? "$name.min.js" : "$name.js";

const { FuseBox, QuantumPlugin} = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    output: `dist/${outputName}`,
    sourceMaps: !IsProduction && { inline: false },
    plugins : [
        IsProduction && 
        QuantumPlugin({
            bakeApiIntoBundle : projectName,
            treeshake: true,
            uglify: true,
            target: "universal"
        })
    ]
});

const bundle = fuse.bundle(projectName);

if(IsTest) {
    console.log("-----------RUNNING TESTS--------");
    bundle.test("tests/TestInit.ts");
} else {
    bundle.instructions(`app/AppInit.ts`);
}
    

fuse.run();