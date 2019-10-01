/** @module svg */
// add typescript support for svg
declare module "*.svg" {
  const content: any;
  export default content;
}
