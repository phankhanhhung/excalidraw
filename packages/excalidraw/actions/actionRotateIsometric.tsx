import { CaptureUpdateAction } from "@excalidraw/element";

import { register } from "./register";

import type { Action } from "./types";

/**
 * Rotates the isometric view yaw by `delta` radians. Passing `null`
 * resets the rotation to 0. The rotation is normalized to the
 * `[-π, π]` range so the value doesn't grow unboundedly as the user
 * keeps rotating in the same direction.
 */
export const actionRotateIsometric = register<number | null>({
  name: "rotateIsometric",
  label: "labels.rotateIsometric",
  viewMode: true,
  trackEvent: {
    category: "canvas",
  },
  perform(elements, appState, delta) {
    if (delta === null || delta === undefined) {
      return {
        appState: { ...appState, isometricAngle: 0 },
        captureUpdate: CaptureUpdateAction.EVENTUALLY,
      };
    }
    let next = (appState.isometricAngle || 0) + delta;
    // normalize to [-π, π]
    const TWO_PI = Math.PI * 2;
    next = ((next + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
    return {
      appState: { ...appState, isometricAngle: next },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
} satisfies Action<number | null>);
