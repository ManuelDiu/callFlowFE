import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

interface Props {
    setFile: any,
    defaultImage?: string,
}

const Container = styled.div`
  ${tw`w-full relative overflow-hidden h-full rounded-full border-gray-300 shadow-md`}
`;

const ImagePickerContainer = styled.label`
  ${tw`w-full h-auto cursor-pointer p-2 bg-black/50 absolute bottom-0 flex items-center justify-center`}
`;

const AvatarSelector = ({setFile, defaultImage}: Props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_USER_IMAGE);


  useEffect(() => {
    if (defaultImage){
      setPreview(defaultImage)
    }
  }, [defaultImage])

  const handleImageChange = (e: any) => {
    const file = e?.target?.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  useEffect(() => {
    setFile(selectedFile);
  }, [selectedFile])

  return (
    <Container>
      <ImagePickerContainer htmlFor="fileSelect">
        <MdOutlineAddPhotoAlternate color="white" size={30} />
      </ImagePickerContainer>
      <img
        src={preview}
        alt="User Image"
        className="w-full h-full rounded-full object-cover"
      />
      <input
        id="fileSelect"
        onChange={handleImageChange}
        name="fileSelect"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        className="hidden"
      />
    </Container>
  );
};

export default AvatarSelector;
