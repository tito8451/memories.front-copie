import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTravel } from '../../reducers/travel';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { reverseDate } from '../../utils/functions';
import {API_KEY} from '@env'

export default function TravelCard({ travel, navigation, onClick }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isDelete, setIsDelete] = useState(false);

  const handleClick = () => {
    onClick();
    navigation.navigate('Travel', { travelId: travel._id });
  };

  const handleDelete = () => {
    fetch(`${API_KEY}/travel/deleteTrip?travelId=${travel._id}&userId=${user._id}`, {
      method: 'DELETE',
    })
    .then (response => response.json())
    .then(data => {
     if(data.result) {
        dispatch(deleteTravel(travel._id));
        setIsDelete(false);
      }
    })
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsDelete(false)}>
      <View style={tw`flex flex-col`}>
        {isDelete && (
          <View style={tw`flex items-end`}>
            <TouchableOpacity
              style={tw`bg-[#073040] flex items-center p-[.3rem] rounded-[.5rem]`}
              onPress={handleDelete}
            >
              <FontAwesome name="times" size={16} color="#F2DCC2" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.buttonTravelCard}
          onPress={() => handleClick()}
          onLongPress={() => setIsDelete(true)}
        >
          <View style={styles.imageContainer}>
            {travel.coverImage ? (
              <Image source={{ uri: travel.coverImage }} style={styles.image} />
            ) : (
              <Image source={require('../../assets/favicon.png')} style={styles.image} />
            )}
          </View>
          <View style={styles.travelCardTextContainer}>
            <Text style={styles.travelCardDestination}>{travel.destination}</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.travelCardDate}>Du {reverseDate(travel.departure)}</Text>
              <Text style={styles.travelCardDate}>au {reverseDate(travel.return)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  buttonTravelCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: width * 0.8,
    height: height * 0.17, // Ajustez la hauteur pour englober toute l'image
    alignItems: 'center',
    paddingRight: 8,
    marginBottom: 32,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    overflow: 'hidden', // Masque toute partie d'image qui dépasse
  },
  image: {
    width: width * 0.28,
    height: height * 0.17, // Assurez-vous que la hauteur correspond à la hauteur du conteneur
    borderRadius: 10,
  },
  travelCardTextContainer: {
    padding: 10,
    justifyContent: 'space-around',
    height: height * 0.15, // Ajustez la hauteur pour correspondre à la hauteur du bouton
    backgroundColor: '#073040',
    width: width * 0.52,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  travelCardDate: {
    color: '#F2DCC2',
    fontSize: Math.min(width, height) * 0.04,
  },
  travelCardDestination: {
    color: '#F2DCC2',
    fontSize: Math.min(width, height) * 0.06,
    marginBottom: 16,
  },
});
