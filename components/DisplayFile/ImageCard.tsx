import React, { useEffect, useState } from "react";
import { ActionDiv } from "./ActionDiv";
import { Tooltip } from "react-tooltip";
import type { errors as _ } from "../../content";
import { useDispatch } from "react-redux";
import { getFileDetailsTooltipContent } from "../../src/utils";
import { Loader } from "./Loader";
import { readPsd } from 'ag-psd';

interface ImageCardProps {
  index: number;
  provided: any;
  extension: string;
  errors: _;
  file: File;
  fileDetailProps: [string, string, string];
  loader_text: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  index,
  provided,
  extension,
  errors,
  file,
  fileDetailProps,
  loader_text,
}) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showImg, setShowImg] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tooltipSize, setToolTipSize] = useState("");
  const dispatch = useDispatch();
  let isSubscribed = true;

  useEffect(() => {
    const getTooltipContent = async () => {
      const size = await getFileDetailsTooltipContent(
        file,
        ...fileDetailProps,
        dispatch,
        errors
      );
      if (isSubscribed) {
        setToolTipSize(size);
      }
    };
    getTooltipContent();
  }, [file, fileDetailProps, dispatch, errors]);

  useEffect(() => {
    const processFile = async () => {
      try {
        setShowLoader(true);
        if (extension && (extension === ".psd" || extension === ".psb")) {
          const arrayBuffer = await file.arrayBuffer();
          const psd = readPsd(new Uint8Array(arrayBuffer));

          if (psd.canvas) {
            const dataUrl = psd.canvas.toDataURL();
            if (isSubscribed) {
              setImageUrl(dataUrl);
            }
          } else {
            console.error("Failed to render PSD: No canvas available");
          }
        } else if (extension === ".jpg" || extension === ".jpeg" || extension === ".png") {
          const reader = new FileReader();
          reader.onload = function (event: ProgressEvent<FileReader>) {
            const imageUrl = (event.target as FileReader).result as string;
            if (isSubscribed) {
              setImageUrl(imageUrl);
            }
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Error processing files:", error);
      } finally {
        if (isSubscribed) {
          setShowLoader(false);
        }
      }
    };
    processFile();
    return () => {
      isSubscribed = false;
    };
  }, [extension, file]);

  return (
    <div
      className="drag-element-img"
      data-tooltip-id={`image_tooltip_${index}`}
      data-tooltip-html={tooltipSize}
      data-tooltip-place="top"
      {...provided.dragHandleProps}
      style={{
        height: showImg ? "auto" : "126px",
      }}
    >
      <ActionDiv
        extension={extension}
        index={index}
        errors={errors}
        fileName={file.name}
      />
      {showLoader && <Loader loader_text={loader_text} />}
      <bdi>
        <Tooltip id={`image_tooltip_${index}`} />
      </bdi>
      <div>
        <img
          className="img-fluid-custom object-fit-cover border rounded"
          src={imageUrl}
          alt={`Selected file ${index}`}
          draggable={false}
          style={{
            opacity: showImg ? "1" : "0",
          }}
          onError={() => setShowImg(false)}
          onLoad={() => {
            setShowLoader(false);
            setShowImg(true);
          }}
        />
      </div>
      <p className="text-center">{file.name}</p>
    </div>
  );
};

export default ImageCard;