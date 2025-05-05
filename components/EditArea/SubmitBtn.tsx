import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useFileStore } from "../../src/file-store";
import { ToolState, setField } from "../../src/store";
import type { edit_page } from "../../content";
import { fetchSubscriptionStatus, canUseSiteToday } from "fetch-subscription-status";
export function SubmitBtn({
  k,
  edit_page,
  lang
}: {
  k: string;
  edit_page: edit_page;
  lang: string;
}): JSX.Element {
  const dispatch = useDispatch();
  const { submitBtn } = useFileStore();
  // state variables:
  const errorMessage = useSelector(
    (state: { tool: ToolState }) => state.tool.errorMessage
  );
  const isSubmitted = useSelector(
    (state: { tool: ToolState }) => state.tool.isSubmitted
  );
  return (
    <button
      className={`submit-btn btn btn-lg text-white position-relative overflow-hidden ${k} grid-footer`}
      onClick={() => {
        dispatch(setField({ isSubmitted: true }));
        dispatch(setField({ showOptions: false }));
        if (submitBtn) {
          submitBtn?.current?.click();
        }
      }}
      disabled={errorMessage.length > 0}
    >
      <bdi>
        {
          edit_page.action_buttons[
          k.replace(/-/g, "_") as keyof typeof edit_page.action_buttons
          ]
        }
      </bdi>{" "}
      {isSubmitted ? (
        <Spinner as="span" animation="grow" role="status" aria-hidden="true" />
      ) : null}
    </button>
  );
}
