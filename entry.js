import { hex } from './cjs-dep.cjs';
export default { fetch() { return new Response(hex()); } };
