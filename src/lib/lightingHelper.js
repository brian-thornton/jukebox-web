import { applyEventSegments, powerOff, setEffect, setSolidColor, applyPreset } from './lighting-client';

export const applyLighting = async (settings, event) => {
  if (settings.preferences.useLightingControllers) {
    try {
      if (settings?.lighting?.controllers) {
        for (const controller of settings?.lighting?.controllers) {
          const masterController = settings.controllers.find((c) => c.ip === controller.ip);

          if (masterController.online) {
            const lightingController = settings?.lighting?.controllers?.find(c => c.ip === controller.ip);

            if (lightingController) {
              const currentEvent = lightingController.events.find(e => e.event === event);
              if (currentEvent) {
                applyPreset(lightingController.ip, currentEvent.preset);
              }
              // }

              // const eventSegments = controller.segments.filter((s) => s.event === event);
              // if (eventSegments?.length > 0) {
              //   console.log(eventSegments);
              //   try {
              //     console.log(`running segments for ${controller.ip}`);
              //     applyEventSegments(controller.ip, eventSegments);
              //   } catch (err) {
              //     console.log(err)
              //     // Do nothing. If we make a call to the controller and the call fails
              //     // simply move on to the next controller
              //   }
              // }
            }
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }
}

