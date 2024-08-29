import { Dispatch, SetStateAction, useEffect } from "react";
import type { errors as _ } from "../../content";
import ImageCard from "./ImageCard";
import FileCard from "./FileCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { isDraggableExtension } from "../../src/utils";
import { useRouter } from "next/router";
import { useFileStore } from "../../src/file-store";

type FileProps = {
  errors: _;
  extension: string;
  toolTipSizes: string[];
  setToolTipSizes: Dispatch<SetStateAction<string[]>>;
  loader_text: string;
  showSpinner: boolean;
  fileDetailProps: [string, string, string];
};
const Files = ({
  errors,
  extension,
  toolTipSizes,
  loader_text,
  showSpinner,
  fileDetailProps,
}: FileProps) => {
  // const store = useSelector((state: { tool: ToolState }) => state.tool);
  const { files, imageUrls, setImageUrls } = useFileStore();

  useEffect(() => { }, [files]);

  const router = useRouter();
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    // Argument of type 'Blob[]' is not assignable to parameter of type 'File[]'.
    // Type 'Blob' is missing the following properties from type 'File': lastModified, webkitRelativePathts(2345)
    if (isDraggableExtension(extension, router)) {
      // dispatch(setFiles(store.files));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="imageUrls" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={`display-file ${snapshot.isDraggingOver ? "dragging-over" : ""
                }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* this is what cause the error instead of imageUrls i want to use the files array it's a File[] */}
              {files.map((file, index) => (
                <Draggable
                  key={file.name}
                  draggableId={file.name}
                  index={index}
                  isDragDisabled={!isDraggableExtension(extension, router)}
                >
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className={`drag-element ${snapshot.isDragging ? "dragging" : ""
                        }`}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      {/* isDraggableExtension(extension) ? ( */}
                      {extension === ".psd" ? (
                        (() => {
                          return (
                            <ImageCard
                              index={index}
                              provided={provided}
                              extension={extension}
                              errors={errors}
                              fileDetailProps={fileDetailProps}
                              file={file}
                              loader_text={loader_text}
                            />
                          );
                        })()
                      ) : (
                        <FileCard
                          extension={extension}
                          file={file}
                          index={index}
                          isDraggable={isDraggableExtension(extension, router)}
                          provided={provided}
                          snapshot={snapshot}
                          errors={errors}
                          loader_text={loader_text}
                          fileDetailProps={fileDetailProps}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Files;
