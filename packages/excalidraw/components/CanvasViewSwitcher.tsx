import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";

import { isFrameLikeElement } from "@excalidraw/element";

import type {
  ExcalidrawElement,
  ExcalidrawFrameLikeElement,
} from "@excalidraw/element/types";

import { actionSetFloorFilter } from "../actions/actionSetFloorFilter";
import { actionToggleIsometricView } from "../actions/actionToggleIsometric";

import { Island } from "./Island";

import "./CanvasViewSwitcher.scss";

import type { ActionManager } from "../actions/manager";
import type { UIAppState } from "../types";

interface CanvasViewSwitcherProps {
  appState: UIAppState;
  elements: readonly ExcalidrawElement[];
  actionManager: ActionManager;
}

/**
 * Floating on-canvas control that lets the user:
 *  1. switch between "floors" (frames) via a dropdown — implementing
 *     a lightweight Z / height dimension where each floor is a
 *     separate 2D plane;
 *  2. toggle a read-only isometric (pseudo-3D) preview of the canvas.
 *
 * Intended primarily for the real-estate / architectural-sketch
 * workflow where users draw each floor of a building on its own frame.
 */
export const CanvasViewSwitcher = ({
  appState,
  elements,
  actionManager,
}: CanvasViewSwitcherProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const floors = useMemo<ExcalidrawFrameLikeElement[]>(() => {
    return elements.filter(
      (el): el is ExcalidrawFrameLikeElement =>
        !el.isDeleted && isFrameLikeElement(el),
    );
  }, [elements]);

  const activeFloor = useMemo(
    () =>
      appState.floorFilterFrameId
        ? floors.find((f) => f.id === appState.floorFilterFrameId) ?? null
        : null,
    [floors, appState.floorFilterFrameId],
  );

  const handleSelectFloor = useCallback(
    (frameId: string | null) => {
      actionManager.executeAction(
        actionSetFloorFilter,
        "ui",
        frameId,
      );
      setMenuOpen(false);
    },
    [actionManager],
  );

  const handleToggleIsometric = useCallback(() => {
    actionManager.executeAction(actionToggleIsometricView);
  }, [actionManager]);

  const floorLabel = activeFloor?.name || "All floors";

  return (
    <Island className="CanvasViewSwitcher" padding={1}>
      <div className="CanvasViewSwitcher__floor">
        <button
          type="button"
          className="CanvasViewSwitcher__floor-trigger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          title={
            floors.length === 0
              ? "Create a frame to use it as a floor"
              : "Active floor (filter by frame)"
          }
          disabled={floors.length === 0 && !appState.floorFilterFrameId}
        >
          <span className="CanvasViewSwitcher__floor-icon" aria-hidden="true">
            ▣
          </span>
          <span className="CanvasViewSwitcher__floor-label">{floorLabel}</span>
          <span className="CanvasViewSwitcher__chevron" aria-hidden="true">
            ▾
          </span>
        </button>
        {menuOpen && (
          <ul className="CanvasViewSwitcher__menu" role="listbox">
            <li
              role="option"
              aria-selected={appState.floorFilterFrameId === null}
              className={clsx("CanvasViewSwitcher__menu-item", {
                "CanvasViewSwitcher__menu-item--active":
                  appState.floorFilterFrameId === null,
              })}
              onClick={() => handleSelectFloor(null)}
            >
              All floors
            </li>
            {floors.length === 0 ? (
              <li className="CanvasViewSwitcher__menu-item CanvasViewSwitcher__menu-item--empty">
                No frames yet — create a frame first
              </li>
            ) : (
              floors.map((frame, idx) => (
                <li
                  key={frame.id}
                  role="option"
                  aria-selected={appState.floorFilterFrameId === frame.id}
                  className={clsx("CanvasViewSwitcher__menu-item", {
                    "CanvasViewSwitcher__menu-item--active":
                      appState.floorFilterFrameId === frame.id,
                  })}
                  onClick={() => handleSelectFloor(frame.id)}
                >
                  {frame.name || `Floor ${idx + 1}`}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="CanvasViewSwitcher__divider" aria-hidden="true" />
      <label
        className={clsx("CanvasViewSwitcher__toggle", {
          "CanvasViewSwitcher__toggle--on": appState.isometricView,
        })}
        title="Toggle isometric (pseudo-3D) preview — Alt+I"
      >
        <input
          type="checkbox"
          checked={appState.isometricView}
          onChange={handleToggleIsometric}
        />
        <span className="CanvasViewSwitcher__toggle-track">
          <span className="CanvasViewSwitcher__toggle-thumb" />
        </span>
        <span className="CanvasViewSwitcher__toggle-label">3D</span>
      </label>
    </Island>
  );
};
