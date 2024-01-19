const typescript = require("@rollup/plugin-typescript");
const progress = require("rollup-plugin-progress");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const cleanup = require("rollup-plugin-cleanup");
const copy = require('rollup-plugin-copy');
const path = require('path');


const config_d = {
    folder: "NotifyPlus",
    input: "NotifyPlus.ts",
    output: "main.js",
    loader: "loader.user.js",
}

const relative_dir = path.relative(".", __dirname).replace(/\\/g, "/");

const config = {
    input: `${relative_dir}/${config_d.input}`,
    output: {
        file: `public/${config_d.folder}/${config_d.output}`,
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true,
    plugins: [
        copy({
            targets: [
                { src: `${relative_dir}/${config_d.loader}`, dest: `public/${config_d.folder}` }
            ]
        }),
        progress({ clearLine: true }),
        resolve({ browser: true }),
        typescript({ tsconfig: `${relative_dir}/tsconfig.json`, inlineSources: true }),
        commonjs(),
        cleanup({
            comments: 'none',
            sourcemap: false,
        })
    ],
}

module.exports = config;