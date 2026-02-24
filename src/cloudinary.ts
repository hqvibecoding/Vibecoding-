const CLOUD_NAME = "dj8ge55xe";
const UPLOAD_PRESET = "3d_portfolio";

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary Upload Error Response:", errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Network Error:", error);
    if (error.message === "Failed to fetch") {
      throw new Error("Network Error: Could not connect to Cloudinary. Check your internet or if Cloudinary is blocked.");
    }
    throw error;
  }
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
      let errorMsg = "Failed to delete from Cloudinary";
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Error deleting from Cloudinary:", error);
    if (error.message === "Failed to fetch") {
      throw new Error("Local Server Error: Could not connect to the backend. Try refreshing the page.");
    }
    throw error;
  }
};
