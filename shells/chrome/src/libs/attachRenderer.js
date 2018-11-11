/* eslint-disable */
const attachRendererFiber = require('./attachRendererFiber');

/**
 * This takes care of patching the renderer to emit events on the global
 * `Hook`. The returned object has a `.cleanup` method to un-patch everything.
 */
function attachRenderer(hook, rid, renderer) {
  const rootNodeIDMap = new Map();
  const extras = {};
  // Before 0.13 there was no Reconciler, so we patch Component.Mixin
  const isPre013 = !renderer.Reconciler;
  // React Fiber
  if (typeof renderer.findFiberByHostInstance === 'function') {
    return attachRendererFiber(hook, rid, renderer);
  }

  // TODO:
  debugger;
}

module.exports = attachRenderer;
