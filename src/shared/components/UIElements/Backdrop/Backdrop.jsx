import "./Backdrop.css";

import ReactDom from"react-dom";

const Backdrop=props=>{

    return ReactDom.createPortal(
        (<div className="backdrop" onClick={props.onClick}></div>),
        document.getElementById("backdrop"));
}

export default Backdrop;