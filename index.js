/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import NewSite from './NewSite';
import Sites from './Sites';
import PlacesNear from './placesNear';
import placesCamera from './placesCamera';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => placesCamera);
