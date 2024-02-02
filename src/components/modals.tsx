import cx from "classnames";
import React, { FC, PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useModal } from "../core/modals";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface Props {
  title?: ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
  showHeader?: boolean;
  footerAlignLeft?: boolean;
  className?: string;
  bodyClassName?: string;
  contentClassName?: string;
  children: JSX.Element | [JSX.Element] | [JSX.Element, JSX.Element];
}

export const Modal: FC<PropsWithChildren<Props>> = ({
  onClose,
  onSubmit,
  title,
  children,
  showHeader = true,
  footerAlignLeft = false,
  className,
  bodyClassName,
  contentClassName,
}) => {
  const { t } = useTranslation();
  const childrenArray = Array.isArray(children) ? children : [children];
  const body = childrenArray[0];
  const footer = childrenArray[1];
  useKeyboardShortcuts([
    {
      code: "Escape",
      handler: () => {
        if (onClose) onClose();
      },
    },
  ]);

  const content = (
    <>
      {showHeader && (
        <div className="modal-header">
          {title && <h5 className="modal-title d-flex align-items-center flex-grow-1">{title}</h5>}
          <button
            type="button"
            title={t("common.close").toString()}
            className="btn-close"
            aria-label="Close"
            onClick={() => onClose && onClose()}
            disabled={!onClose}
          ></button>
        </div>
      )}
      {body && (
        <div id="modal-body" className={cx("modal-body", bodyClassName)}>
          {body}
        </div>
      )}
      {footer && (
        <div
          className="modal-footer"
          style={{
            justifyContent: footerAlignLeft ? "left" : "flex-end",
          }}
        >
          {footer}
        </div>
      )}
    </>
  );

  return (
    <>
      <div
        role="dialog"
        className="modal fade show"
        style={{ display: "block" }}
        onClick={(e) => {
          if (onClose && e.target === e.currentTarget) onClose();
        }}
      >
        <div
          role="document"
          className={cx("modal-dialog", "modal-dialog-centered", "modal-dialog-scrollable", className)}
        >
          {onSubmit ? (
            <form
              className={cx("modal-content", contentClassName)}
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              {content}
            </form>
          ) : (
            <div className={cx("modal-content", contentClassName)}>{content}</div>
          )}
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export const Modals: FC = () => {
  const { modal, closeModal } = useModal();

  return modal
    ? React.createElement(modal.component, {
        arguments: modal.arguments,
        cancel: () => {
          if (modal.beforeCancel) modal.beforeCancel();
          closeModal();
          if (modal.afterCancel) modal.afterCancel();
        },
        submit: (args) => {
          if (modal.beforeSubmit) modal.beforeSubmit(args);
          closeModal();
          if (modal.afterSubmit) modal.afterSubmit(args);
        },
      })
    : null;
};
