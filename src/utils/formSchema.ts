import { z } from "zod";

export const formSchema = z.object({
  locationName: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  longitude: z
    .string()
    .refine(
      (val) => /^-?\d*(\.?\d*)?$/.test(val) && val !== "",
      "Longitude is required and must be a number"
    )
    .refine((val) => {
      const num = Number(val);
      return num >= -180 && num <= 180;
    }, "Longitude must be between -180 and 180"),
  latitude: z
    .string()
    .refine(
      (val) => /^-?\d*(\.?\d*)?$/.test(val) && val !== "",
      "Latitude is required and must be a number"
    )
    .refine((val) => {
      const num = Number(val);
      return num >= -90 && num <= 90;
    }, "Latitude must be between -90 and 90"),
  files: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});
