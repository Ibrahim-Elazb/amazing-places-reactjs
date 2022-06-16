
import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "../Backdrop/Backdrop";
import { CSSTransition } from "react-transition-group";

import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.modalClass}`}>
      <div className={`modal__header ${props.headerClass}`}>
        <h2>{props.modalHeader}</h2>
      </div>
      <form
        onSubmit={
          props.onSubmit
            ? props.onSubmit
            : (event) => {
                event.preventDefault();
              }
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <div className={`modal__footer ${props.footerClass}`}>
          {props.modalFooter}
        </div>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

const Modal = (props) => {
  return <>
    {props.show && <Backdrop onClick={props.onCancel}/>}
    <CSSTransition
      in={props.show}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames="modal"
    >
      <ModalOverlay {...props} />
    </CSSTransition>
  </>;
};

export default Modal;
