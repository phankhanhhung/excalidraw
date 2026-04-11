import { FONT_FAMILY } from "@excalidraw/common";

import { newElement, newFrameElement, newTextElement } from "@excalidraw/element";
import { CaptureUpdateAction } from "@excalidraw/element";

import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/element/types";

import { register } from "./register";

import type { Action } from "./types";

/**
 * Injects a ready-made multi-floor real-estate demo into the scene so
 * the user can immediately see the floor-filter + isometric view
 * features in action without having to draw anything first.
 *
 * Layout: three vertically-stacked frames (Tầng 1 / Tầng 2 / Tầng 3),
 * each containing a few rectangles representing rooms and a text
 * label. Positioned with a ~540px vertical gap so that when the
 * isometric projection is applied they visually stack like the
 * floors of a building.
 */

const DEMO_FONT_FAMILY = FONT_FAMILY.Excalifont;
const FONT_SIZE = 20;
const FRAME_WIDTH = 600;
const FRAME_HEIGHT = 420;
const FRAME_GAP = 540; // distance between stacked frames

type FloorSpec = {
  name: string;
  accent: string;
  rooms: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    bg: string;
  }>;
};

const FLOORS: FloorSpec[] = [
  {
    name: "Tầng 1 — Thương mại",
    accent: "#c92a2a",
    rooms: [
      { x: 20, y: 60, w: 260, h: 180, label: "Sảnh", bg: "#ffe3e3" },
      { x: 300, y: 60, w: 140, h: 180, label: "Quầy", bg: "#ffd8a8" },
      { x: 460, y: 60, w: 120, h: 80, label: "WC", bg: "#d0ebff" },
      { x: 460, y: 160, w: 120, h: 80, label: "Kho", bg: "#e9ecef" },
      { x: 20, y: 260, w: 560, h: 140, label: "Khu trưng bày", bg: "#fff3bf" },
    ],
  },
  {
    name: "Tầng 2 — Văn phòng",
    accent: "#2b8a3e",
    rooms: [
      { x: 20, y: 60, w: 180, h: 140, label: "Phòng họp", bg: "#d3f9d8" },
      { x: 220, y: 60, w: 360, h: 140, label: "Open space", bg: "#e9ecef" },
      { x: 20, y: 220, w: 140, h: 180, label: "Giám đốc", bg: "#ffe3e3" },
      { x: 180, y: 220, w: 260, h: 180, label: "Pantry", bg: "#fff3bf" },
      { x: 460, y: 220, w: 120, h: 180, label: "WC", bg: "#d0ebff" },
    ],
  },
  {
    name: "Tầng 3 — Căn hộ",
    accent: "#1864ab",
    rooms: [
      { x: 20, y: 60, w: 240, h: 160, label: "Phòng khách", bg: "#fff3bf" },
      { x: 280, y: 60, w: 300, h: 160, label: "Bếp + ăn", bg: "#ffe066" },
      { x: 20, y: 240, w: 180, h: 160, label: "Ngủ 1", bg: "#d3f9d8" },
      { x: 220, y: 240, w: 180, h: 160, label: "Ngủ 2", bg: "#d3f9d8" },
      { x: 420, y: 240, w: 160, h: 160, label: "WC + Logia", bg: "#d0ebff" },
    ],
  },
];

const buildDemoElements = (): ExcalidrawElement[] => {
  const out: ExcalidrawElement[] = [];

  FLOORS.forEach((floor, idx) => {
    const frameX = 200;
    const frameY = 200 + idx * FRAME_GAP;

    const frame = newFrameElement({
      x: frameX,
      y: frameY,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      name: floor.name,
      strokeColor: floor.accent,
      backgroundColor: "transparent",
    });
    out.push(frame);

    // Rooms — rectangles bound to the frame via frameId
    floor.rooms.forEach((room) => {
      const rect = newElement({
        type: "rectangle",
        x: frameX + room.x,
        y: frameY + room.y,
        width: room.w,
        height: room.h,
        strokeColor: "#1e1e1e",
        backgroundColor: room.bg,
        fillStyle: "solid",
        strokeWidth: 2,
        roughness: 1,
        roundness: { type: 3 },
        frameId: frame.id,
      });
      out.push(rect);

      // Text label for each room
      const label = newTextElement({
        x: frameX + room.x + room.w / 2,
        y: frameY + room.y + room.h / 2 - FONT_SIZE / 2,
        text: room.label,
        fontSize: FONT_SIZE,
        fontFamily: DEMO_FONT_FAMILY,
        textAlign: "center",
        verticalAlign: "middle",
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        roundness: null,
        frameId: frame.id,
      });
      out.push(label);
    });

    // Floor name big text above the frame (NOT inside the frame so
    // it's visible even when the floor filter is active)
    const heading = newTextElement({
      x: frameX,
      y: frameY - 52,
      text: floor.name,
      fontSize: 32,
      fontFamily: DEMO_FONT_FAMILY,
      textAlign: "left",
      verticalAlign: "top",
      strokeColor: floor.accent,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 1,
      roundness: null,
      frameId: frame.id,
    });
    out.push(heading);
  });

  return out;
};

export const actionLoadFloorsDemo = register<void>({
  name: "loadFloorsDemo",
  label: "labels.loadFloorsDemo",
  viewMode: false,
  trackEvent: {
    category: "canvas",
  },
  perform(elements, appState) {
    const demo = buildDemoElements();
    return {
      elements: [
        ...elements,
        ...(demo as unknown as OrderedExcalidrawElement[]),
      ],
      appState: {
        ...appState,
        // Jump to a zoom/scroll that frames the demo nicely
        scrollX: -120,
        scrollY: -120,
      },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    };
  },
} satisfies Action<void>);
