import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useState } from "react";

const DEFAULT_IMAGES_FOLDER = "images";

const useUploadImage = ({ folder = DEFAULT_IMAGES_FOLDER }: any) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (file: any) => {
    try {
        if (!file) {
            return null;
          }
          const storageRef = ref(
            storage,
            `/${folder}/${Date.now() + file?.name}`
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