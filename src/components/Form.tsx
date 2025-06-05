import { useState } from "react";
import { formSchema } from "@/utils/formSchema";
import type { FormData } from "@/utils/types";
import { supabase } from "@/lib/db/supabase";
import LocationAutocomplete, {
  type PlaceSuggestion,
} from "@/components/LocationAutocomplete";
import { ZodError } from "zod";

export default function Form({
  modalIcon,
  setModalIcon,
}: {
  modalIcon: boolean;
  setModalIcon: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = useState<FormData>({
    locationName: "",
    description: "",
    longitude: "",
    latitude: "",
    files: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLocationSelect = (place: PlaceSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      locationName: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = formSchema.safeParse({
      locationName: formData.locationName.trim(),
      description: formData.description.trim(),
      longitude: formData.longitude.trim(),
      latitude: formData.latitude.trim(),
      files: formData.files,
    });

    if (!result.success) {
      const fieldErrors: { [index: string]: string } = {};
      result.error.errors.forEach((err: ZodError["errors"][0]) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if location exists
      const { data: existingLocation, error: fetchError } = await supabase
        .from("locations")
        .select("*")
        .eq("location_name", formData.locationName.toLowerCase())
        .maybeSingle();

      let locationId: string;

      if (fetchError) throw fetchError;

      if (existingLocation) {
        locationId = existingLocation.id;
      } else {
        // Insert new location
        const { data: newLocation, error: locationError } = await supabase
          .from("locations")
          .insert({
            location_name: formData.locationName.toLowerCase(),
            description: formData.description.toLowerCase(),
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
          })
          .select()
          .single();

        if (locationError) throw locationError;
        locationId = newLocation.id;
      }

      // Upload images to Supabase Storage
      const uploadPromises = formData.files.map(async (file) => {
        try {
          // Validate file type
          if (!file.type.startsWith("image/")) {
            throw new Error(`Invalid file type: ${file.type}`);
          }

          // Validate file size (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error("File size too large. Maximum size is 5MB");
          }

          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${locationId}/${fileName}`;

          // Save image: Upload binary image file to Supabase Storage bucket
          const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // File is now stored and accessible via a URL, but there's no database record yet
          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(filePath);

          // Insert image: Create a new row in images table
          const { error: imageError } = await supabase.from("images").insert({
            location_id: locationId,
            name: file.name,
            url: publicUrl,
            description: formData.description,
          });

          if (imageError) throw imageError;

          return { success: true };
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return { success: false, error };
        }
      });

      const results = await Promise.all(uploadPromises);
      const failedUploads = results.filter((r) => !r.success);

      if (failedUploads.length > 0) {
        throw new Error(`${failedUploads.length} images failed to upload`);
      }

      setIsSubmitted(true);
      setFormData({
        locationName: "",
        description: "",
        longitude: "",
        latitude: "",
        files: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to submit form. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      files: files,
    });
  };

  if (isSubmitted) {
    return <div>Form submitted successfully</div>;
  }

  return (
    <>
      {modalIcon && (
        <div className="fixed inset-0 z-50" onClick={() => setModalIcon(false)}>
          <div
            className="absolute top-20 right-8 bg-white p-6 rounded shadow pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSubmit}
              className=" w-80 h-160 bg-white rounded-full font-mono"
            >
              <div className="flex flex-col justify-center w-full h-full gap-2">
                <p className="text-xl font-mono font-bold text-blue-950 mb-2">
                  Location name
                </p>
                <LocationAutocomplete
                  value={formData.locationName}
                  onSelect={handleLocationSelect}
                  disabled={isSubmitting}
                />
                {errors.locationName && (
                  <span className="text-red-500">{errors.locationName}</span>
                )}
                <p className="text-xl font-mono font-bold text-blue-950 mb-2">
                  Add description
                </p>
                <input
                  className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
                  type="text"
                  placeholder="Paris in summer..."
                  maxLength={40}
                  value={formData?.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
                {errors.description && (
                  <span className="text-red-500">{errors.description}</span>
                )}
                <p className="text-xl font-mono font-bold text-blue-950 mb-2">
                  Latitude
                </p>
                <input
                  className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData?.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: e.target.value,
                    })
                  }
                />
                {errors.latitude && (
                  <span className="text-red-500">{errors.latitude}</span>
                )}
                <p className="text-xl font-mono font-bold text-blue-950 mb-2">
                  Longitude
                </p>
                <input
                  className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData?.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: e.target.value,
                    })
                  }
                />
                {errors.longitude && (
                  <span className="text-red-500">{errors.longitude}</span>
                )}
                <label className="block w-full cursor-pointer mt-4">
                  <span className="bg-slate-500 text-white px-4 py-2 rounded">
                    Choose Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                {errors.files && (
                  <span className="text-red-500">{errors.files}</span>
                )}
                {formData?.files.length > 0 &&
                  formData?.files.map((file, idx) => (
                    <span key={file.name + file.lastModified + idx}>
                      {file.name}
                    </span>
                  ))}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer disabled:bg-gray-500"
                >
                  {isSubmitting ? "Submitting..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
