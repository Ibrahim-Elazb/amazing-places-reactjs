import Card from "../../shared/components/UIElements/Card/Card";
import PlaceItem from "./PlaceItem";
import "./PlacesList.css"

const PlacesList=(props)=>{

return(
    <ul className="places-list">
      {props.places.length > 0 ? 
          props.places.map((place) => (
            <PlaceItem
              key={place._id}
              id={place._id}
              title={place.title}
              imageUrl={place.image}
              description={place.description}
              address={place.address}
              coordinates={place.location}
              creatorId={place.creator}
              deletePlaceHandler={props.deletePlaceHandler}
            />)): <Card><h1>No Places</h1></Card>}
    </ul>)
}

export default PlacesList;