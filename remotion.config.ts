import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Needed for @remotion/three (WebGL) when rendering on a machine without a GPU
Config.setChromiumOpenGlRenderer('angle');
// Chrome 158+ removed the automatic software-WebGL fallback: without this flag
// the headless shell throws "Error creating WebGL context" (verified 2026-11-19).
Config.setChromiumFlags({'enable-unsafe-swiftshader': true});
