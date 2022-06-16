// @ts-nocheck
import { useContext, useState } from "react";
// import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// import useHttp from "../../hooks/useHttp";
import Button from "../../shared/components/FormElements/Button/Button";
// import SuccessContainer from "../../shared/components/FormElements/SuccessContainer/SuccessContainer";
import Card from "../../shared/components/UIElements/Card/Card";
import Map from "../../shared/components/UIElements/Map/Map";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const loginContext = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDeletConfirm, setShowDeletConfirm] = useState(false);
  // const [successMsg,setSuccessMsg]=useState();
  // const { isLoading, responseError, clearErrors, sendRequest } = useHttp();
  // const history = useHistory();

  const openMapModal = () => {
    setShowMap(true);
  };
  const closeMapModal = () => {
    setShowMap(false);
  };
  const openDeleteConfirmModal = () => {
    setShowDeletConfirm(true);
  };
  const closeDeleteConfirmModal = () => {
    setShowDeletConfirm(false);
  };
  const deleteConfirmHandler = () => {
    // console.log("deleted")
    // const url=`${process.env.REACT_APP_SERVER_URL}places/place/${props.id}`;
    // const data=await sendRequest(url, "DELETE",null,{"Authorization":loginContext.token});
    // if(data){
    //   setSuccessMsg(data.message)
    //   setTimeout(() => {
    //     console.log(loginContext.id)
    //     history.push(`/`)
    //   }, 2000);
    // }
    props.deletePlaceHandler(props.id);
    closeDeleteConfirmModal();
  };
  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapModal}
        headerClass={`place-item__modal-header`}
        contentClass={`place-item__modal-content`}
        modalHeader={props.address}
        footerClass={`place-item__modal-actions`}
        modalFooter={<Button onClick={closeMapModal}>Close</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeletConfirm}
        onCancel={closeDeleteConfirmModal}
        headerClass={`place-item__modal-header`}
        contentClass={`place-item__modal-content`}
        modalHeader=" Attention !!! "
        footerClass={`place-item__modal-actions`}
        modalFooter={
          <>
            <Button inverse onClick={deleteConfirmHandler}>
              Confirm
            </Button>
            <Button danger onClick={closeDeleteConfirmModal}>
              Close
            </Button>
          </>
        }
      >
        <p
          style={{
            padding: "1rem",
            fontSize: "1.2rem",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          Are You Sure You Want To delete this place ?
        </p>
      </Modal>
      {/* <Modal
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
        {(responseError instanceof Array)?
          responseError.map((item, index) => (
            <div key={index}>- {item}</div>
          )):
          <div>- {responseError}</div>}
      </Modal> */}
      <li className="place-item">
        <Card className="place_item__content">
          {/* {successMsg&&<SuccessContainer>{successMsg}</SuccessContainer>} */}
          <div className="place-item__image">
            <img
              src={props.imageUrl}
              alt={props.title}
              style={{ width: "100%", objectFit: "contain" }}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapModal}>
              View on Map
            </Button>
            {loginContext.isLogin && props.creatorId === loginContext.id && (
              <Button to={`/places/${props.id}/`}>Edit</Button>
            )}
            {loginContext.isLogin && props.creatorId === loginContext.id && (
              <Button onClick={openDeleteConfirmModal} danger>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
