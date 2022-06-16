import Card from "../../shared/components/UIElements/Card/Card";
import UserItem from "./UserItem";
import "./UsersList.css";

const UsersList = (props) => {
  return (
    <ul className="users-list">
      {props.users.length > 0 ? 
          props.users.map((user) => (
            <UserItem
              key={user.id}
              id={user.id}
              name={user.name}
              image={user.image}
              placesCount={user.places}
            />)): <Card><h1>No Users</h1></Card>}
    </ul>
  );
};

export default UsersList;
