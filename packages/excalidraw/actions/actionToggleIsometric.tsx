import { KEYS } from "@excalidraw/common";

import { CaptureUpdateAction } from "@excalidraw/element";

import { register } from "./register";

/**
 * Toggles a pseudo-3D (isometric) preview of the canvas. When enabled,
 * the whole canvas is rendered with an isometric projection giving the
 * impression of "height". The mode is read-only; pointer interactions
 * are disabled while isometricView is on.
 *
 * Keyboard shortcut: Alt+I
 */
export const actionToggleIsometricView = register({
  name: "isometricView",
  label: "labels.isometricView",
  viewMode: true,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.isometricView,
  },
  perform(elements, appState) {
    return {
      appState: {
        ...appState,
        isometricView: !this.checked!(appState),
      },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
  checked: (appState) => appState.isometricView,
  predicate: (elements, appState, appProps) => {
    return typeof appProps.viewModeEnabled === "undefined";
  },
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === "KeyI",
});
