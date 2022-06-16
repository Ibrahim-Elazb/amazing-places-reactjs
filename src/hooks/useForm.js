import { useReducer } from "react";

export const CHANGE_VALUE="CHANGE_VALUE";
export const SET_DATA="SET_DATA";

const formReducerHandler=(currentState,action)=>{
    if(action.type?.toString()==="CHANGE_VALUE"){
      let formValid=true;
      for (const inputId in currentState.inputs) {
        if(action?.payload?.inputId?.toString()===inputId){
          formValid=formValid&&action?.payload?.isValid;
        }else{
          formValid=formValid&&currentState.inputs[inputId].isValid;
        }
      }
      return {
        inputs:{
          ...currentState.inputs,
          [action.payload?.inputId]:{
            value:action?.payload?.value,
            isValid:action.payload?.isValid
          }
        },
        formValid
      }
    }else if(action.type?.toString()==="SET_DATA"){
        return {
            inputs:{...action?.payload?.inputs},
            formValid:action?.payload?.formValid
        }
    }else{
      return currentState;
    }
  }

const useForm=(formInitState)=>{
    const [formState,dispatcher]=useReducer(formReducerHandler,formInitState);
    return [formState,dispatcher];
}


export default useForm;