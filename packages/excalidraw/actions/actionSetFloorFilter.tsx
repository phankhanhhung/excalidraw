import { CaptureUpdateAction } from "@excalidraw/element";

import { register } from "./register";

import type { Action } from "./types";

/**
 * Sets the "floor filter": the id of a Frame whose contents should be
 * shown exclusively on the canvas. Passing `null` (or `undefined`)
 * disables the filter and shows all floors. This lets users work on
 * multi-level floor plans by dedicating one frame per floor and
 * switching between them.
 */
export const actionSetFloorFilter = register<string | null>({
  name: "setFloorFilter",
  label: "labels.floorFilter",
  viewMode: true,
  trackEvent: {
    category: "canvas",
  },
  perform(elements, appState, frameId) {
    return {
      appState: {
        ...appState,
        floorFilterFrameId: frameId ?? null,
      },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
} satisfies Action<string | null>);
