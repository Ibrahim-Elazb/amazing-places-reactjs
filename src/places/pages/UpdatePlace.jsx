// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import useForm, { CHANGE_VALUE, SET_DATA } from "../../hooks/useForm";
import useHttp from "../../hooks/useHttp";
import Button from "../../shared/components/FormElements/Button/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import Input from "../../shared/components/FormElements/Input/Input";
import Loading from "../../shared/components/FormElements/Loading/Loading";
import SuccessContainer from "../../shared/components/FormElements/SuccessContainer/SuccessContainer";
import Card from "../../shared/components/UIElements/Card/Card";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import {
  VALIDATOR_MAX_LENGTH,
  VALIDATOR_MIN_LENGTH,
  VALIDATOR_REQUIRED,
} from "../../shared/util/validators";
import "./UpdatePlace.css";

const formInitState = {
  inputs: {
    placeName: { value: "", isValid: false },
    description: { value: "", isValid: false },
    address: { value: "", isValid: false },
  },
  formValid: false,
};

const UpdatePlace = (props) => {
  const placeId = useParams().place_id;
  const [formState, dispatcher] = useForm(formInitState);
  const { isLoading, responseError, clearErrors, sendRequest } = useHttp();
  const auth = useContext(AuthContext);
  const [successMsg, setSuccessMsg] = useState();
  const history=useHistory();

  const onInputHandler = useCallback(
    (id, value, isValid) => {
      dispatcher({
        type: CHANGE_VALUE,
        payload: { inputId: id, value, isValid },
      });
    },
    [dispatcher]
  );

  const onDataShowHandler = useCallback(
    (foundPlace) => {
      dispatcher({
        type: SET_DATA,
        payload: {
          inputs: {
            placeName: { value: foundPlace?.title, isValid: true },
            description: { value: foundPlace?.description, isValid: true },
            address: { value: foundPlace?.address, isValid: true },
            image: { value: foundPlace?.image, isValid: true },
          },
          formValid: true,
        },
      });
    },
    [dispatcher]
  );

  useEffect(() => {
    const fetchPlaces = async () => {
      const url = `${process.env.REACT_APP_SERVER_URL}places/place/${placeId}`;
      const foundPlace = await sendRequest(url, "GET", null, {
        Authorization: auth.token,
      });
      if (foundPlace?.place) {
        onDataShowHandler(foundPlace.place);
      }
    };

    fetchPlaces();
  }, [auth.token, onDataShowHandler, placeId, sendRequest]);

  const updatePlaceSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const title = formState.inputs.placeName.value;
    const description = formState.inputs.description.value;
    const address = formState.inputs.address.value;
    const image=formState.inputs.image.value;

    const data =
      await sendRequest(`https://maps.googleapis.com/maps/api/geocode/json?address=
    ${encodeURIComponent(
      address
    )}&key=AIzaSyAuL2CBCv09w5PU2s3aMrO2va1qn33XOF4`);
    const location = data.results[0].geometry.location;
    formData.append("title", title);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("location[lat]", location.lat);
    formData.append("location[lng]", location.lng);
    if(typeof image!=="string")formData.append("image", image);
    const result = await sendRequest(
      `${process.env.REACT_APP_SERVER_URL}places/place/${placeId}`,
      "PATCH",
      formData,
      { Authorization: auth.token }
    );
    if (result) {
      setTimeout(() => {
        history.push(`/${auth.id}/places`)
      }, 1000);
      setSuccessMsg(result.message);
    }
  };

  return (
    <div className="edit-place">
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
      {!isLoading && formState && (
        <Card className="edit-place__card">
          {successMsg && <SuccessContainer>{successMsg}</SuccessContainer>}
          <form id="place-form" onSubmit={updatePlaceSubmit}>
            <Input
              id="placeName"
              element="input"
              type="text"
              title="Place Name"
              validators={[
                VALIDATOR_REQUIRED(),
                VALIDATOR_MAX_LENGTH(50),
                VALIDATOR_MIN_LENGTH(5),
              ]}
              errorText="Enter Valid Place Name at least 5 characters and at most 50 character"
              onInput={onInputHandler}
              value={formState?.inputs?.placeName?.value || ""}
              valid={formState?.inputs?.placeName?.isValid || false}
            />
            <Input
              id="description"
              title="Description"
              validators={[
                VALIDATOR_REQUIRED(),
                VALIDATOR_MAX_LENGTH(50),
                VALIDATOR_MIN_LENGTH(5),
              ]}
              errorText="Enter Valid Description at least 5 characters and at most 50 character"
              onInput={onInputHandler}
              value={formState?.inputs?.description?.value || ""}
              valid={formState?.inputs?.description?.isValid || false}
            />
            <Input
              id="address"
              title="Address"
              validators={[VALIDATOR_REQUIRED()]}
              errorText="Enter Address "
              onInput={onInputHandler}
              value={formState?.inputs?.address?.value || ""}
              valid={formState?.inputs?.address?.isValid || false}
            />
            <ImageUpload
              id="image"
              errorText="Choose an image"
              value={formState?.inputs?.image?.value || ""}
              valid={formState?.inputs?.image?.isValid || false}
              onInput={onInputHandler}
            />
            <Button type="submit" disabled={!formState.formValid}>
              Update Place
            </Button>
          </form>
        </Card>
      )}
      {!isLoading && !formState && (
        <Card className="edit-place__card">
          <h1>No Place Found</h1>
        </Card>
      )}
      {isLoading && <Loading />}
    </div>
  );
};

export default UpdatePlace;
