import DisplayFile from "./DisplayFile";
import {
  useEffect,
  useRef
} from "react";

import type { edit_page } from "../content";
import ErrorElement from "./ErrorElement";
import type { errors as _ } from "../content";
import { CogIcon } from "@heroicons/react/outline";
// import { ToolStoreContext } from "../src/ToolStoreContext";
import { useDispatch, useSelector } from "react-redux";
import {
  ToolState,
  resetErrorMessage,
  setField
} from "../src/store";
import { useFileStore } from "../src/file-store";
import AddMoreButton from "./EditArea/AddMoreButton";
import { SubmitBtn } from "./EditArea/SubmitBtn";

type editPageProps = {
  extension: string;
  edit_page: edit_page;
  pages: string;
  page: string;
  lang: string;
  errors: _;
  path: string;
};
// the error message is inside the editPage component
// calculate image height;

const EditPage = ({
  extension,
  edit_page,
  pages,
  page,
  lang,
  errors,
  path
}: editPageProps) => {
  // const [showOptions, setShowOptions] = useState(false);
  // state variables:
  const errorCode = useSelector(
    (state: { tool: ToolState }) => state.tool.errorCode
  );
  const showTool = useSelector(
    (state: { tool: ToolState }) => state.tool.showTool
  );
  const showDownloadBtn = useSelector(
    (state: { tool: ToolState }) => state.tool.showDownloadBtn
  );
  const navHeight = useSelector(
    (state: { tool: ToolState }) => state.tool.nav_height
  );
  const showOptions = useSelector(
    (state: { tool: ToolState }) => state.tool.showOptions
  );
  const dispatch = useDispatch();
  // actual files;
  const { files, setFiles, fileInput, submitBtn } = useFileStore();
  useEffect(() => {
    if (errorCode == "ERR_NO_FILES_SELECTED" && files.length > 0) {
      dispatch(resetErrorMessage());
    }
  }, [files, errorCode]);
  // gearRef
  const gearRef = useRef(null);
  return (
    <aside
      className={`edit-page ${showTool || showDownloadBtn ? "d-none" : ""}`}
    >
      <section className="edit-area position-relative">
        <DisplayFile
          extension={extension}
          pages={pages}
          page={page}
          lang={lang}
          errors={errors}
          edit_page={edit_page}
        />
        {/* {state?.showErrorMessage ? <ErrorElement state={state} /> : null} */}
        <ErrorElement />
        <AddMoreButton
          onClick={() => {
            if (fileInput) {
              fileInput?.current?.click();
            }
          }}
          lang={lang}
          path={path}
          text={edit_page.add_more_button}
        />
        {/* when clicking on this  */}
        <button
          className="gear-button btn btn-light"
          onClick={() => {
            dispatch(setField({ showOptions: !showOptions }));
          }}
          ref={gearRef}
          style={
            showOptions
              ? {
                top:
                  navHeight +
                  (gearRef.current
                    ? (gearRef.current as HTMLElement).clientHeight
                    : 0),
              }
              : {}
          }
        >
          <CogIcon className="w-6 h-6 me-2 gear-icon" />
        </button>
      </section>
      <section
        className={`options bg-white ${showOptions ? " expanded" : ""}`}
        style={
          showOptions
            ? {
              top: navHeight,
            }
            : {}
        }
      >
        <h5 className="text-uppercase grid-header">
          <bdi>
            {
              edit_page.edit_page_titles[
              path.replace(/-/g, "_") as keyof typeof edit_page.edit_page_titles
              ]
            }
          </bdi>
        </h5>
        {/* <Options layout={k as OptionsProps["layout"]} edit_page={edit_page} /> */}
        <div className="hide-onsmall">
          <SubmitBtn k={path} edit_page={edit_page} lang={lang} />
        </div>
      </section>
      <div className="show-onsmall">
        <SubmitBtn k={path} edit_page={edit_page} lang={lang} />
      </div>
    </aside>
  );
};

export default EditPage;
