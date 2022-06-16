// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import useHttp from "../../hooks/useHttp";
import Button from "../../shared/components/FormElements/Button/Button";
import Loading from "../../shared/components/FormElements/Loading/Loading";
import SuccessContainer from "../../shared/components/FormElements/SuccessContainer/SuccessContainer";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import PlacesList from "../components/PlacesList";

const UserPlaces = () => {
  const { isLoading, responseError, clearErrors, sendRequest } = useHttp();
  const [successMsg,setSuccessMsg]=useState();
  const [foundPlaces,setFoundPlaces]=useState([]);
  const auth = useContext(AuthContext);
  const params = useParams();
  const userId = params["user_id"];
  useEffect(() => {
    const fetchPlaces = async () => {
      const url = `${process.env.REACT_APP_SERVER_URL}places/user/${userId}`;
      const userPlaces = await sendRequest(url,"GET",null,{ Authorization: auth.token });
      setFoundPlaces(userPlaces.places)
    };
    fetchPlaces();
  }, [auth.token, sendRequest, userId]);
  // const userPlaces = DUMMY_PLACES.filter(
  //   (place) => place.creator.toString() === userId.toString()
  // );
  const deleteConfirmHandler=(placeId)=>{
    const deletePlace=async()=>{
    console.log("deleted")
    const url=`${process.env.REACT_APP_SERVER_URL}places/place/${placeId}`;
    const data=await sendRequest(url, "DELETE",null,{"Authorization":auth.token});
    if(data){
      setSuccessMsg(data.message)
      setFoundPlaces(foundPlaces.filter(place=>place._id.toString()!==placeId.toString()))
      setTimeout(() => {
        setSuccessMsg("")
      }, 1000);
    }
  }
  deletePlace();
}
  return (
    <>
      <Modal
        show={responseError ? true : false}
        onCancel={() => {
          clearErrors();
        }}
        modalHeader="Error Occurred"
        contentClass="error__modal-content"
        modalFooter={
          <Button
            onClick={() => {
              clearErrors();
            }}
          >
            Close
          </Button>
        }
      >
        {responseError instanceof Array ? (
          responseError.map((item, index) => <div key={index}>- {item}</div>)
        ) : (
          <div>- {responseError}</div>
        )}
      </Modal>
      {successMsg&&<SuccessContainer>{successMsg}</SuccessContainer>}
      {!isLoading ? <PlacesList places={foundPlaces} deletePlaceHandler={deleteConfirmHandler}/> : <Loading />}
    </>
  );
};

export default UserPlaces;
