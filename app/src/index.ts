import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-700.css';
import './style.css';
import { parseParams } from './params';

const params = parseParams(window.location.search);
document.body.dataset['state'] = params.state ?? 'attract';
