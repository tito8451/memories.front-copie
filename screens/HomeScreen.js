import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import mapStyle from '../components/homepage/mapStyle.json';
import LayoutHome from '../components/homepage/LayoutHome';
import TravelList from '../components/homepage/TravelList';
import NewTravel from '../components/homepage/NewTravel';
import { useSelector, useDispatch } from 'react-redux';
import { initTravel } from '../reducers/travel';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const travels = useSelector((state) => state.travel.value);

  const [isOpen, setIsOpen] = useState(false);
  const [modalY] = useState(new Animated.Value(height)); // affichage du bouton ok, quand fermé
  const [newTravel, setNewTravel] = useState(false);
  const [newTravelName, setNewTravelName] = useState('');

  const handleCompassPress = () => {
    setNewTravelName('');
    setNewTravel(false);
    setIsOpen(!isOpen);
    isOpen ? closeModal() : openModal();
  };

  const openModal = () => {
    Animated.timing(modalY, {
      duration: 300,
      toValue: 60, //jouer avec les tailles ici
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalY, {
      duration: 300,
      toValue: height + 10, // affichage du bouton ok, quand fermé
      useNativeDriver: true,
    }).start();
  };

  const handleLongPressMap = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
    )
      .then((response) => response.json())
      .then((data) => {
        const country = data.address.country;
        setNewTravelName(country);
        setNewTravel(true);
        setIsOpen(true);
        openModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePressMarker = (id) => {
    navigation.navigate('Travel', { travelId: id });
  };

  useFocusEffect(
    useCallback(() => {
      const getTravels = fetch(`${API_KEY}/travel?token=${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(initTravel(data.trips));
      })
      .catch((error) => {
        console.error(error);
      });

      return () => getTravels;
    }, [])
  );

  return (
    <View style={tw`w-full h-full`}>
      <MapView
        initialRegion={{
          latitude: 30,
          longitude: 10,
          latitudeDelta: 60,
          longitudeDelta: 60,
        }}
        style={{ flex: 1 }}
        customMapStyle={mapStyle}
        onLongPress={(e) => handleLongPressMap(e)}
      >
        {travels && travels.length > 0 && (
          <>
            {travels.map((data, i) => {
              return (
                <Marker
                  key={i}
                  coordinate={{
                    latitude: data.location.coordinates[0],
                    longitude: data.location.coordinates[1],
                  }}
                  title={data.name}
                  onPress={() => handlePressMarker(data._id)}
                />
              );
            })}
          </>
        )}
      </MapView>
      <View style={tw`items-center p-0 ${isOpen ? 'h-full' : ''}`}>
        <Animated.View
          style={{
            ...styles.modal,
            backgroundColor: `${isOpen ? '#F2DDC2' : '#D8725B'}`,
            transform: [{ translateY: modalY }],
          }}
        >
          {isOpen && (
            <View
              style={{
                backgroundColor: '#D8725B',
                height: 50,
                width: '100%',
              }}
            />
          )}
          <TouchableOpacity
            onPress={handleCompassPress}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/compass.png')}
              alt="compass"
              style={{ height: 48, width: 48 }}
            />
          </TouchableOpacity>
          <LayoutHome
            children={
              newTravel ? (
                <NewTravel
                  navigation={navigation}
                  newTravelName={newTravelName}
                  onClick={handleCompassPress}
                />
              ) : (
                <TravelList
                  setNewTravel={setNewTravel}
                  navigation={navigation}
                  onClick={handleCompassPress}
                />
              )
            }
            type={`${newTravel ? 'new' : 'travel'}`}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// DESIGN A REVOIR
const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 0,
    border: 0,
    height: '100%',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: '#D8725B',
    backgroundColor: '#073141',
    justifyContent: 'center',
    alignItems: 'center',
    top: -32,
  },
  modal: {
    width: width,
    height: height - 15,
    alignItems: 'center',
    backgroundColor: '#F2DDC2',
    position: 'absolute',
    bottom: 60,
    left: 0,
  },
});
