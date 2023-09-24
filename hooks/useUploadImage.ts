import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useState } from "react";

const useUploadImage = () => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (file: any) => {
    try {
        if (!file) {
            return null;
          }
          const storageRef = ref(
            storage,
            `/images/${Date.now() + file?.name}`
          ); // modificar esta línea para usar un nombre distinto para el archivo
          const uploadTask = uploadBytesResumable(storageRef, file);
          await uploadTask;
          const newUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(newUrl);
          return newUrl;
    } catch (error) {
        setImageError("Error al submir imagen");
        return "";
    }
  };

  return {
    handleUpload,
    imageError,
    imageUrl,
  };
};

export default useUploadImage;