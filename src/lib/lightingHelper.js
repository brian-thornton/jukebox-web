import { powerOff, setEffect, setSolidColor } from './lighting-client';

export const applyLighting = async (settings, event) => {
  if (settings?.lighting?.controllers) {
    for (const controller of settings?.lighting?.controllers) {

      // settings.lighting.controllers.map((controller) => {
      if (!controller.segments.find((s) => s.event === event)) {
        powerOff(controller.ip);
      } else {
        const eventSegments = controller.segments.filter((s) => s.event === event);
        for (const eventSegment of eventSegments) {
          if (eventSegment.effect === "Off") {
            console.log('in power off');
            await powerOff(controller.ip);
          } else if (eventSegment.effect !== "Solid") {
            console.log('in set effect');
            await setEffect(controller.ip, eventSegment.effect, eventSegment.palette, eventSegment.start, eventSegment.stop);
          } else if (eventSegment.effect === 'Solid') {
            console.log('in solid color');
            await setSolidColor(controller.ip, [eventSegment.color.map((s) => s.toString())], eventSegment.start, eventSegment.stop);
          }
        }
      }
    }
  }
}

