import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-[var(--color-accent-yellow)] sketch-border relative cursor-pointer hover:-rotate-6 transition-transform">
          <LuUser className="text-4xl text-black" onClick={onChooseFile} />

          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-[var(--color-accent-pink)] text-black sketch-border absolute -bottom-3 -right-3 cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl}
            alt="profile photo"
            className="w-20 h-20 object-cover sketch-border bg-white"
          />
          
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-white text-black sketch-border absolute -bottom-3 -right-3 cursor-pointer hover:bg-[var(--color-accent-pink)]"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};
export default ProfilePhotoSelector;
