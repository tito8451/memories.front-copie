import React from 'react';
import { View, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { useState } from 'react';
import Button from '../Button';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function SelectListing({ addInfos, toggleModal }) {
  const [selected, setSelected] = useState('');

  const options = [
    { key: '1', value: 'Location de voiture' },
    { key: '2', value: "Billet d'avion" },
    { key: '3', value: 'Logement' },
    { key: '4', value: 'Autre' },
  ];

  const updateSelectedValue = (value) => {
    switch (value) {
      case 'Location de voiture':
        setSelected('carRentals');
        break;
      case "Billet d'avion":
        setSelected('flights');
        break;
      case 'Autre':
        setSelected('others');
        break;
      case 'Logement':
        setSelected('accommodations');
        break;
      default:
        setSelected('');
        break;
    }
  }

  return (
    <View style={tw`w-4/5 h-auto bg-[#f7ebda] rounded-[.625rem] p-3`}>
      <View style={tw`flex-row-reverse mb-3 rounded-[.5rem] p-[.5rem]`}>
        <FontAwesome
          name="window-close"
          color="#073040"
          size={16}
          onPress={() => toggleModal()}
          style={tw`absolute rounded-[.5rem]`}
        />
      </View>
      <View style={tw`justify-center items-center`}>
        <Text style={[tw`font-bold text-[1rem] p-[1rem]`, { color: '#073040' }]}>
          Ajouter des informations
        </Text>
        <View style={tw`my-[1rem] w-11/12`}>
          <SelectList
            setSelected={(val) => updateSelectedValue(val)}
            data={options}
            save="value"
            placeholder="Sélectionnez une activité"
            searchPlaceholder="Rechercher"
            maxHeight={150}
            boxStyles={{
              borderColor: 'transparent',
              backgroundColor: 'lightgray',
            }}
            inputStyles={{
              borderColor: 'transparent',
              backgroundColor: 'lightgray',
              margin: '10',
            }}
            dropdownStyles={{
              borderColor: 'transparent',
              backgroundColor: 'lightgray',
            }}
          />
        </View>
        <View style={tw`my-[1rem] w-full flex items-center`}>
          <Button title="Ajouter" onClick={() => addInfos(selected)} />
        </View>
      </View>
    </View>
  );
}
