// @ts-nocheck
import Button from "../../shared/components/FormElements/Button/Button";
import Input from "../../shared/components/FormElements/Input/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import Card from "../../shared/components/UIElements/Card/Card";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN_LENGTH,
  VALIDATOR_PASSWORD,
  VALIDATOR_REQUIRED,
} from "../../shared/util/validators";
import useForm, { CHANGE_VALUE } from "../../hooks/useForm";
import "./Auth.css";
import { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../shared/components/FormElements/Loading/Loading";
import useHttp from "../../hooks/useHttp";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import SuccessContainer from "../../shared/components/FormElements/SuccessContainer/SuccessContainer";
const signupFormInitState = {
  inputs: {
    userName: { value: "", isValid: false },
    userEmail: { value: "", isValid: false },
    password: { value: "", isValid: false },
    confirmPassword: { value: "", isValid: false },
    image: { value: "", isValid: false },
  },
  formValid: false,
};
const loginFormInitState = {
  inputs: {
    userEmail: { value: "", isValid: false },
    password: { value: "", isValid: false },
  },
  formValid: false,
};
const Auth = (props) => {
  const history = useHistory();
  const [successMsg,setSuccessMsg]=useState();
  const loginContext = useContext(AuthContext);

  const [loginFormState, loginDispatcher] = useForm(loginFormInitState);
  const [signUpFormState, signUpDispatcher] = useForm(signupFormInitState);

  const [loginMode, setLoginMode] = useState(true);
  const { isLoading, responseError, clearErrors, sendRequest } = useHttp();

  const logInSubmit = (event) => {
    event.preventDefault();
    sendRequest(
      process.env.REACT_APP_SERVER_URL+"auth/login",
      "POST",
      JSON.stringify({
        email: loginFormState.inputs?.userEmail?.value || "",
        password: loginFormState.inputs?.password?.value || "",
      }),
      {
        "Content-Type": "application/json",
      }
    ).then((data) => {
      if (data) {
        clearErrors();
        loginContext.logInHandler("Bearer " + data.token,data.id);
        history.push("/");
      }
    });
  };

  const signupSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const name = signUpFormState.inputs?.userName?.value;
    const email = signUpFormState.inputs?.userEmail?.value;
    const password = signUpFormState.inputs?.password?.value;
    const confirmPassword = signUpFormState.inputs?.confirmPassword?.value ;
    const image=signUpFormState.inputs?.image?.value;

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", image);
    sendRequest(
      process.env.REACT_APP_SERVER_URL+"auth/signup",
      "POST",
      formData
    ).then((data) => {
      if (data) {
        console.log("Done" + data.message);
        clearErrors();
        setSuccessMsg(data.message)
        setTimeout(() => {
          setLoginMode(true);
        }, 2000);
      }
    });
  };

  const switchModeHandler = () => {
    setLoginMode((loginMode) => !loginMode);
  };

  const onInputHandler = useCallback(
    (id, value, isValid) => {
      if (loginMode) {
        loginDispatcher({
          type: CHANGE_VALUE,
          payload: { inputId: id, value, isValid },
        });
      } else {
        signUpDispatcher({
          type: CHANGE_VALUE,
          payload: { inputId: id, value, isValid },
        });
      }
    },
    [loginDispatcher, loginMode, signUpDispatcher]
  );

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
      {!isLoading ? (
        <Card className="authentication">
          {!loginMode && (
            <>
              {successMsg&&<SuccessContainer>{successMsg}</SuccessContainer>}
              <form id="signup-form" onSubmit={signupSubmit}>
                <h2>Sign Up</h2>
                <hr />
                <Input
                  id="userName"
                  element="input"
                  type="text"
                  title="Name "
                  placeholder="Enter Your Name ..."
                  validators={[VALIDATOR_REQUIRED(), VALIDATOR_MIN_LENGTH(3)]}
                  errorText="Enter Valid Name"
                  onInput={onInputHandler}
                />
                <Input
                  id="userEmail"
                  element="input"
                  type="email"
                  title="Email"
                  placeholder="Enter Your Email ..."
                  validators={[VALIDATOR_REQUIRED(), VALIDATOR_EMAIL()]}
                  errorText="Enter Valid Email Address"
                  onInput={onInputHandler}
                />
                <Input
                  id="password"
                  title="Password"
                  element="input"
                  type="password"
                  placeholder="Enter Password ..."
                  validators={[VALIDATOR_PASSWORD()]}
                  errorText=" password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters"
                  onInput={onInputHandler}
                />
                <Input
                  id="confirmPassword"
                  title="Confirm Password"
                  element="input"
                  type="password"
                  placeholder="Enter Password Confirm ..."
                  validators={[VALIDATOR_PASSWORD()]}
                  errorText="Password and Confirm Password should be matched"
                  onInput={onInputHandler}
                />
                <ImageUpload
                id="image"
                errorText="Choose an image"
                onInput={onInputHandler}
                />
                <Button
                  type="submit"
                  disabled={!signUpFormState?.formValid || false}
                >
                  Sign Up
                </Button>
              </form>
            </>
          )}
          {loginMode && (
            <form id="login-form" onSubmit={logInSubmit}>
              <h2>Login</h2>
              <hr />
              <Input
                id="userEmail"
                element="input"
                type="text"
                title="Email"
                placeholder="Enter Your Email ..."
                validators={[VALIDATOR_REQUIRED(), VALIDATOR_EMAIL()]}
                errorText="Enter Valid Email Address"
                onInput={onInputHandler}
              />
              <Input
                id="password"
                title="Password"
                element="input"
                type="password"
                placeholder="Enter Password ..."
                validators={[VALIDATOR_REQUIRED()]}
                errorText="Enter Password"
                onInput={onInputHandler}
              />
              <Button
                type="submit"
                disabled={!loginFormState?.formValid || false}
              >
                Log in
              </Button>
            </form>
          )}
          <Button type="button" onClick={switchModeHandler}>
            Switch to {loginMode ? "Sign Up" : "Log in"}
          </Button>
        </Card>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Auth;
