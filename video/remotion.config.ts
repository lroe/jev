import fs from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// Local development uses the system Chrome; on Colab the browser is downloaded
// by `npx remotion browser ensure` / the render script.
if (fs.existsSync('/usr/bin/google-chrome')) {
  Config.setBrowserExecutable('/usr/bin/google-chrome');
}
