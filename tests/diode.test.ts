import { test, expect } from "bun:test"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { fp } from "../src/footprinter"

test("diode", () => {
  const soup = fp().diode().imperial("0402").soup()
  const svgContent = convertCircuitJsonToPcbSvg(soup)
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode")
})

test("diode pin 1 is on the closed silkscreen side", () => {
  const soup = fp().diode().imperial("0402").circuitJson()
  type PcbRectPad = Extract<
    (typeof soup)[number],
    { type: "pcb_smtpad"; shape: "rect" }
  >
  const pads = soup.filter(
    (element): element is PcbRectPad =>
      element.type === "pcb_smtpad" && element.shape === "rect",
  )
  const pin1 = pads.find((pad) => pad.port_hints?.includes("1"))
  const pin2 = pads.find((pad) => pad.port_hints?.includes("2"))
  type PcbSilkscreenText = Extract<
    (typeof soup)[number],
    { type: "pcb_silkscreen_text" }
  >
  type PcbSilkscreenPath = Extract<
    (typeof soup)[number],
    { type: "pcb_silkscreen_path" }
  >
  const plusMarker = soup.find(
    (element): element is PcbSilkscreenText =>
      element.type === "pcb_silkscreen_text" && element.text === "+",
  )
  const outline = soup.find(
    (element): element is PcbSilkscreenPath =>
      element.type === "pcb_silkscreen_path",
  )

  expect(pin1?.x).toBeLessThan(0)
  expect(pin2?.x).toBeGreaterThan(0)
  expect(outline?.route[1]?.x).toBeLessThan(0)
  expect(outline?.route[2]?.x).toBeLessThan(0)
  expect(plusMarker?.anchor_position?.x).toBeGreaterThan(0)
})

test("diode0402", () => {
  const soup = fp.string("diode0402").circuitJson()
  const svgContent = convertCircuitJsonToPcbSvg(soup)
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode0402")
})

test("diode1210", () => {
  const soup = fp().diode().imperial("1210").circuitJson()
  const svgContent = convertCircuitJsonToPcbSvg(soup, { showCourtyards: true })
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode1210")
})

test("diode0603", () => {
  const soup = fp().diode().imperial("0603").soup()
  const svgContent = convertCircuitJsonToPcbSvg(soup)
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode0603")
})

test("diode01005", () => {
  const soup = fp().diode().imperial("01005").soup()
  const svgContent = convertCircuitJsonToPcbSvg(soup)
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode01005")
})

test("diode0201", () => {
  const soup = fp().diode().imperial("0201").soup()
  const svgContent = convertCircuitJsonToPcbSvg(soup)
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode0201")
})

test("diode2512", () => {
  const soup = fp().diode().imperial("2512").soup()
  const svgContent = convertCircuitJsonToPcbSvg(soup)
  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "diode2512")
})
