import type { AnySoupElement } from "circuit-json"
import { diode } from "./diode"
import { type PassiveDef } from "../helpers/passive-fn"

export const led = (
  parameters: PassiveDef,
): { circuitJson: AnySoupElement[]; parameters: PassiveDef } => {
  return diode(parameters)
}
