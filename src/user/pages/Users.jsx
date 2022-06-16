// @ts-nocheck
import { useEffect, useState } from "react";
import useHttp from "../../hooks/useHttp";
import Button from "../../shared/components/FormElements/Button/Button";
import Loading from "../../shared/components/FormElements/Loading/Loading";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import UsersList from "../components/UsersList";
// const usersInfo = [
//   { id:"user-01",name: "ali", age: 20,image:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",places:1 },
//   { id:"user-02",name: "ahmed", age: 30,image:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",places:3 },
//   { id:"user-03",name: "mohamed", age: 28,image:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",places:2 },
//   { id:"user-04",name: "khaled", age: 40,image:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",places:6 }
// ];

const Users = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, responseError, clearErrors, sendRequest } = useHttp();
  useEffect(() => {
    sendRequest(process.env.REACT_APP_SERVER_URL+"users/").then((data) => {
      setUsers(
        data?.Users?.map((user) => {
          return {
            id: user._id,
            name: user.name,
            image:
              user.image,
            places: user.placesCount,
          };
        })||[]
      );
    });
  }, [sendRequest]);
  // const [isLoading,setIsLoading]=useState(false);
  // const [responseError,setResponseError]=useState("");

  // useEffect(()=>{
  //   setIsLoading(true);
  //   let responseStatusCode=200;
  //   fetch(process.env.REACT_APP_SERVER_URL+"users/").then((response)=>{
  //     responseStatusCode=response.status;
  //     return response.json();
  //   }).then(data=>{
  //     if(responseStatusCode>=400){
  //       const customError=new Error();
  //       customError.message=data.message;
  //       throw(customError)
  //     }else{
  //       console.log(data)
  //       setUsers(data.Users.map(user=>{return{id:user._id,name:user.name,image:user.image||"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",places:user.placesCount}}))
  //     }
  //   }).catch(error=>{
  //     setResponseError(error.message)
  //   }).finally(()=>{
  //     setIsLoading(false);
  //   })
  // },[])

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
        <div>{responseError}</div>
      </Modal>
      {!isLoading ? <UsersList users={users} /> : <Loading />}
    </>
  );
};

export default Users;
