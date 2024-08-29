import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import EditPage from "./EditPage";
import { ToolState, setField } from "../src/store";

import { useRouter } from "next/router";
import type { edit_page, tools, downloadFile } from "../content";
import type { errors as _ } from "../content";
import ErrorElement from "./ErrorElement";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useFileStore } from "../src/file-store";
import { FileInputForm } from "./Tool/FileInputForm";
import DownloadFile from "./DownloadFile";
import { validateFiles } from "@/src/utils";

export type errorType = {
  response: {
    data: {
      error: string;
      text: () => Promise<string>; // Add type for text() function
    };
  };
};

export type ToolData = {
  title: string;
  description: string;
  color: string;
  type: string;
  to: string;
};

type ToolProps = {
  data: ToolData;
  tools: tools;
  lang: string;
  errors: _;
  edit_page: edit_page;
  pages: string;
  page: string;
  downloadFile: downloadFile;
};

const Tool: React.FC<ToolProps> = ({
  data,
  tools,
  lang,
  errors,
  edit_page,
  pages,
  page,
  downloadFile,
}) => {
  const path = data.to.replace("/", "");
  const stateShowTool = useSelector(
    (state: { tool: ToolState }) => state.tool.showTool
  );
  const errorMessage = useSelector(
    (state: { tool: ToolState }) => state.tool.errorMessage
  );
  // the files:
  const { setFiles } = useFileStore();
  const dispatch = useDispatch();
  // const dispatch = useDispatch();
  const router = useRouter();
  const handleHideTool = () => {
    dispatch(dispatch(setField({ showTool: false })));
  };
  useEffect(() => {
    dispatch(setField({ showDownloadBtn: false }));
  }, []);

  // endpoint
  // const [endpoint, setEndpoint] = useState("");
  // drag and drop input handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const isValid = validateFiles(acceptedFiles, data.type, errors, dispatch, { path: data.to });
    console.log("isValid", isValid);
    if (isValid) {
      setFiles(acceptedFiles);
      handleHideTool();
    }
    handleHideTool();
  }, []);
  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  // file input change handler
  let showTool = stateShowTool && errorMessage?.length > 0;
  // accepted file types
  const acceptedFileTypes = {
    ".pdf": ".pdf, .PDF",
    ".psd": ".psd, .PSD"
  };

  return (
    <>
      <div
        className="tools-page container-fluid position-relative"
        {...(stateShowTool && getRootProps())}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {isDragActive && (
          <div className="overlay display-4">{tools.drop_files}</div>
        )}
        <div
          className={`text-center ${!showTool ? "" : "d-flex"
            } flex-column tools ${stateShowTool ? "" : "d-none"}`}
        >
          <h1 className="display-3">
            <bdi>{data.title}</bdi>
          </h1>
          <p className="lead">
            <bdi>{data.description}</bdi>
          </p>
          <FileInputForm
            lang={lang}
            data={data}
            errors={errors}
            tools={tools}
            acceptedFileTypes={acceptedFileTypes}
          />
          <p>{tools.or_drop}</p>
          <ErrorElement />
        </div>
        {/* ) : ( */}
        <EditPage
          extension={data.type}
          edit_page={edit_page}
          pages={pages}
          page={page}
          lang={lang}
          errors={errors}
          path={path}
        />
        <DownloadFile lang={lang} downloadFile={downloadFile} path={path} />
        {/* )} */}
      </div>
    </>
  );
};

export default Tool;
