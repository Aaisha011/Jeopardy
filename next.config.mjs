// // /** @type {import('next').NextConfig} */
// // const nextConfig = {};

// // export default nextConfig;
// export function webpack(config) {
//     config.resolve.preferRelative = true;
//     return config;
// }
  

// import { resolve } from 'path';

// export function webpack(config) {
//     config.resolve.alias = {
//         ...(config.resolve.alias || {}),
//         // 'ApiClient': resolve(__dirname, 'node_modules/sib-api-v3-sdk/src/ApiClient')
//     };
//     return config;
// }



// export function webpack(config) {
//     config.resolve.alias = {
//         ...(config.resolve.alias || {}),
//         '.ApiClient': false, // Prevent Webpack from resolving 'ApiClient'
//     };
//     return config;
// }
  

export function webpack(config) {
    config.resolve.preferRelative = true;
    return config;
}
  