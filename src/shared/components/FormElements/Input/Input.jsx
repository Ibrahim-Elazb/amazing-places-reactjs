// @ts-nocheck
import { useEffect, useReducer } from "react";
import "./Input.css";
import validator from "../../../util/validators"

const reducerHandler = (currentState, action) => {
  if (action.type.toString() === "CHANGE") {

    return {
      ...currentState,
      value: action.payload.value,
      isValid: validator(action.payload.value,action.payload.validators)
    };
  }else if(action.type.toString() === "TOUCHED") {
    return {
        ...currentState,
        isValid: validator(action.payload.value,action.payload.validators),
        isTouched:true
      };
  } else {
    return currentState;
  }
};

const Input = (props) => {

  const [inputState, dispatcher] = useReducer(reducerHandler, {
    value: props.value||"",
    isValid: props.valid||false,
    isTouched:false
  });

  const {id,onInput}=props;
  const {value,isValid}=inputState;

  const valueChangeHandler = (event) => {
    let value=event.target.value;
    // if(event.target.type.toString()==="file"){
    //    value=event.target.file
    // }
      
      dispatcher({type:"CHANGE",payload:{value,validators:props.validators}});
  };

  const inputTouchedHandler=(event)=>{
    const value=event.target.value;
    dispatcher({type:"TOUCHED",payload:{value,validators:props.validators}});
  };

  useEffect(()=>{
    onInput(id,value,isValid);
  },[id, isValid, onInput, value]);

  return (
    <div className={`form-control ${!inputState.isValid&&inputState.isTouched?"invalid":""}`}>
      <label htmlFor={props.id}>{props.title}</label>
      {props.element?.toString() === "input" ? (
        <input
          id={props.id}
          type={props.type || "text"}
          placeholder={props.placeholder || ""}
          value={inputState.value}
          accept={props.type==="file"?props.accept:""}
          onChange={valueChangeHandler}
          onBlur={inputTouchedHandler}
        />
      ) : (
        <textarea
          id={props.id}
          rows={props.rows || 3}
          placeholder={props.placeholder || ""}
          value={inputState.value}
          onChange={valueChangeHandler}
          onBlur={inputTouchedHandler}
        />
      )}
      {!inputState.isValid&&
      inputState.isTouched&&
      (<div style={{color:"red",padding:"1=10px"}}>
         {props.errorText||"Invalid Input"} 
      </div>)}
    </div>
  );
};

export default Input;
