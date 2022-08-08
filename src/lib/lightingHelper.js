import { applyEventSegments, powerOff, setEffect, setSolidColor } from './lighting-client';

export const applyLighting = async (settings, event) => {
  try {
    if (settings?.lighting?.controllers) {
      for (const controller of settings?.lighting?.controllers) {
        if (!controller.segments.find((s) => s.event === event)) {
          powerOff(controller.ip);
        } else {
          const eventSegments = controller.segments.filter((s) => s.event === event);
          applyEventSegments(controller.ip, eventSegments);
        }
      }
    }
  } catch (ex) {
    console.log(ex);
  }
}

