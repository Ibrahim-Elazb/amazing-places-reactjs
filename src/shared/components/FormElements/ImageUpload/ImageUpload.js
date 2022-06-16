// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import "./ImageUpload.css"

const ImageUpload = (props) => {
    const inputEl = useRef();
    const[file,setFile]=useState();
    const[previewUrl,setPreviewUrl]=useState(props.value);
    const[valid,setValid]=useState(props.valid);

    const openChooserHandler=()=>{
        inputEl.current?.click();
    }

    const fileChooserHandler=(event)=>{
        let pickedFile;
        let isValid;
        if(event.target.files&&event.target.files.length===1){
            pickedFile=event.target.files[0];
            isValid=true;
            setFile(pickedFile)
            setValid(isValid)
        }else{
            isValid=false
            setValid(isValid)
        }
        props.onInput(props.id,pickedFile,isValid)
    }

    useEffect(()=>{
        if(!file){
            return;
        }
        const fileReader=new FileReader();
        fileReader.onload=()=>{
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    },[file])


    return (<div className="form-control">
        <input
            id="image"
            ref={inputEl}
            type="file"
            accept="image/png, image/jpeg,image/jpg"
            style={{ display: "none" }}
            onChange={fileChooserHandler}
        />
        <div className="image-upload center">
            <div className="image-upload__preview ">
                {previewUrl&&<img src={previewUrl} alt="place-preview" />}
                {!previewUrl&&<p>Please, Choose Image</p>}
            </div>
            <Button type="button" onClick={openChooserHandler}>Choose Image</Button>
        </div>
    </div>)
}

export default ImageUpload;