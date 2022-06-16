// @ts-nocheck
import { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useForm, { CHANGE_VALUE } from "../../hooks/useForm";
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
import "./NewPlace.css";

const formInitState = {
  inputs: {
    placeName: { value: "", isValid: false },
    description: { value: "", isValid: false },
    address: { value: "", isValid: false },
    image: { value: "", isValid: false },
  },
  formValid: false,
};

const NewPlace = () => {
  const [formState, dispatcher] = useForm(formInitState);
  const { isLoading, responseError, clearErrors, sendRequest } = useHttp();
  const auth = useContext(AuthContext);
  const [successMsg, setSuccessMsg] = useState();
  const history = useHistory();

  const onInputHandler = useCallback(
    (id, value, isValid) => {
      dispatcher({
        type: CHANGE_VALUE,
        payload: { inputId: id, value, isValid },
      });
    },
    [dispatcher]
  );

  const addPlaceSubmit = async (event) => {
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
    formData.append("image", image);
    const result = await sendRequest(
      `${process.env.REACT_APP_SERVER_URL}places/add-new-place`,
      "POST",
      formData,
      { Authorization: auth.token }
    );
    if (result) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        history.push(`/${auth.id}/places`);
      }, 1000);
    }

    // const formData=new FormData();
    // formData.append("")
    // sendRequest(process.env.REACT_APP_SERVER_URL+"places/add-new-place")
  };

  // console.log(responseError);

  return (
    <div className="new-place">
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
      {!isLoading ? (
        <Card className="new-place__card">
          {successMsg && <SuccessContainer>{successMsg}</SuccessContainer>}
          <form id="place-form" onSubmit={addPlaceSubmit}>
            <Input
              id="placeName"
              element="input"
              type="text"
              title="Place Name"
              placeholder="Enter Place Name ..."
              validators={[
                VALIDATOR_REQUIRED(),
                VALIDATOR_MAX_LENGTH(100),
                VALIDATOR_MIN_LENGTH(5),
              ]}
              errorText="Enter Valid Place Name at least 5 characters and at most 50 character"
              onInput={onInputHandler}
            />
            <Input
              id="description"
              title="Description"
              placeholder="Enter Description ..."
              validators={[
                VALIDATOR_REQUIRED(),
                VALIDATOR_MAX_LENGTH(500),
                VALIDATOR_MIN_LENGTH(10),
              ]}
              errorText="Enter Valid Description at least 5 characters and at most 50 character"
              onInput={onInputHandler}
            />
            <Input
              id="address"
              title="Address"
              element="input"
              placeholder="Enter Address of the Place ..."
              validators={[VALIDATOR_REQUIRED(),
                VALIDATOR_MAX_LENGTH(100),
                VALIDATOR_MIN_LENGTH(3)]}
              errorText="Enter Address "
              onInput={onInputHandler}
            />
            <ImageUpload
              id="image"
              errorText="Choose an image"
              onInput={onInputHandler}
            />
            <Button type="submit" disabled={!formState.formValid}>
              Add Place
            </Button>
          </form>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default NewPlace;
