/**
 * Ambient declaration for `three`.
 *
 * The `three` package does not ship its own type definitions, and the official
 * `@types/three` pulls in a chain of type-only dependencies. Since this project
 * builds with `typescript.ignoreBuildErrors` and only uses a small, well-known
 * slice of the Three.js API inside the landing-page WebGL hero, we declare the
 * module loosely here to keep `tsc` quiet without the extra dependencies.
 */
declare module 'three';
