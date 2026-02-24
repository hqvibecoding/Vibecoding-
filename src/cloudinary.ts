const CLOUD_NAME = "dj8ge55xe";
const UPLOAD_PRESET = "3d_portfolio";

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id
  };
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary Delete Error:", errorData);
      throw new Error(errorData.error || "Failed to delete from Cloudinary");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};
