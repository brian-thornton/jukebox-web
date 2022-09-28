import { applyEventSegments, powerOff, setEffect, setSolidColor } from './lighting-client';

export const applyLighting = async (settings, event) => {
  try {
    if (settings?.lighting?.controllers) {
      for (const controller of settings?.lighting?.controllers) {
        const masterController = settings.controllers.find((c) => c.ip === controller.ip);


        console.log(`controller ${masterController.ip} is online? ${masterController.online}`)
        if (masterController.online) {
          if (!controller.segments.find((s) => s.event === event)) {
            powerOff(controller.ip);
          } else {
            const eventSegments = controller.segments.filter((s) => s.event === event);
            if (eventSegments?.length > 0) {
              console.log(eventSegments);
              try {
                console.log(`running segments for ${controller.ip}`);
                applyEventSegments(controller.ip, eventSegments);
              } catch (err) {
                console.log(err)
                // Do nothing. If we make a call to the controller and the call fails
                // simply move on to the next controller
              }
            }
          }
        }
      }
    }
  } catch (ex) {
    console.log(ex);
  }
}

