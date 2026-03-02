const CLOUD_NAME = "dj8ge55xe";
const UPLOAD_PRESET = "3d_portfolio";

export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void, retries = 3): Promise<{url: string, publicId: string}> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("resource_type", "auto");

  const executeUpload = async (): Promise<{url: string, publicId: string}> => {
    try {
      return await new Promise<{url: string, publicId: string}>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);
        xhr.timeout = 60000; // 60 second timeout for large models

        if (onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(percentComplete);
            }
          };
        }

        xhr.onload = () => {
          let responseBody: any = {};
          try {
            responseBody = JSON.parse(xhr.responseText);
          } catch (e) {}

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              url: responseBody.secure_url,
              publicId: responseBody.public_id
            });
          } else {
            const msg = responseBody.error?.message || xhr.statusText;
            reject(new Error(`Cloudinary Error (${xhr.status}): ${msg}`));
          }
        };

        xhr.ontimeout = () => reject(new Error("TIMEOUT_ERROR"));
        xhr.onerror = () => reject(new Error("NETWORK_ERROR"));
        xhr.send(formData);
      });
    } catch (error: any) {
      if (error.message === "NETWORK_ERROR" || error.message === "TIMEOUT_ERROR") {
        console.warn("Network issue detected, falling back to Fetch API...");
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000);
          
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
            {
              method: "POST",
              body: formData,
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          const data = await response.json();
          if (!response.ok) {
            throw new Error(`Cloudinary Error: ${data.error?.message || response.status}`);
          }

          return {
            url: data.secure_url,
            publicId: data.public_id
          };
        } catch (fetchError: any) {
          if (fetchError.name === 'AbortError') {
            throw new Error("Upload Timed Out: Your internet might be too slow for this file size.");
          }
          throw fetchError;
        }
      }
      throw error;
    }
  };

  // Retry Logic
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await executeUpload();
    } catch (error: any) {
      lastError = error;
      if (error.message.includes("Cloudinary Error (400)")) throw error; // Don't retry client errors
      console.log(`Upload attempt ${i + 1} failed, retrying...`);
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
    }
  }

  throw new Error(lastError?.message === "Failed to fetch" 
    ? "Connection Lost: Please check your internet and try again." 
    : lastError?.message || "Upload Failed");
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
