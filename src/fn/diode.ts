import type {
  AnySoupElement,
  PcbSilkscreenPath,
  PcbSilkscreenText,
} from "circuit-json"
import { rectpad } from "../helpers/rectpad"
import { platedhole } from "../helpers/platedhole"
import {
  createCourtyardRect,
  type PassiveDef,
  resolvePassiveDimensions,
} from "../helpers/passive-fn"
import { silkscreenRef } from "../helpers/silkscreenRef"

export const diode = (
  parameters: PassiveDef,
): { circuitJson: AnySoupElement[]; parameters: PassiveDef } => {
  const { p, pw, ph, standardSize } = resolvePassiveDimensions(parameters)
  const leftPadCenterX = -p / 2
  const rightPadCenterX = p / 2
  const leftOutsidePadX = leftPadCenterX - pw / 2 - 0.25
  const rightOutsidePadX = rightPadCenterX + pw / 2 + 0.2
  const topY = ph / 2 + 0.4
  const bottomY = -ph / 2 - 0.4
  const plusMarker: PcbSilkscreenText = {
    type: "pcb_silkscreen_text",
    pcb_silkscreen_text_id: "silkscreen_plus_1",
    font: "tscircuit2024",
    font_size: 0.48,
    pcb_component_id: "pcb_component_1",
    text: "+",
    layer: "top",
    anchor_position: { x: rightOutsidePadX, y: topY + 0.25 },
    anchor_alignment: "center",
  }
  const silkscreenLines: PcbSilkscreenPath[] = [
    {
      type: "pcb_silkscreen_path",
      layer: "top",
      pcb_component_id: "",
      route: [
        { x: rightPadCenterX, y: topY },
        { x: leftOutsidePadX, y: topY },
        { x: leftOutsidePadX, y: bottomY },
        { x: rightPadCenterX, y: bottomY },
      ],
      stroke_width: 0.1,
      pcb_silkscreen_path_id: "",
    },
  ]
  const textY = parameters.textbottom ? -ph / 2 - 0.9 : ph / 2 + 0.9
  const courtyard =
    standardSize?.courtyard_width_mm && standardSize.courtyard_height_mm
      ? createCourtyardRect(
          standardSize.courtyard_width_mm,
          standardSize.courtyard_height_mm,
        )
      : null

  return {
    circuitJson: [
      parameters.tht
        ? platedhole(1, leftPadCenterX, 0, pw, (pw * 1) / 0.8)
        : rectpad(["1", "left"], leftPadCenterX, 0, pw, ph),
      parameters.tht
        ? platedhole(2, rightPadCenterX, 0, pw, (pw * 1) / 0.8)
        : rectpad(["2", "right"], rightPadCenterX, 0, pw, ph),
      ...silkscreenLines,
      plusMarker,
      silkscreenRef(0, textY, 0.2),
      ...(courtyard ? [courtyard] : []),
    ],
    parameters,
  }
}
