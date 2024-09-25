import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view'; //https://www.npmjs.com/package/react-native-popover-view
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';

export default function ButtonUD({ handleUpdate, handleDelete }) {
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  const handleUpdateClick = () => {
    if (handleUpdate) {
      handleUpdate();
    }
    setPopoverVisible(false);
  };

  const handleDeleteClick = () => {
    if (handleDelete) {
      handleDelete();
    }
    setPopoverVisible(false);
  };

  return (
    <Popover
      isVisible={isPopoverVisible}
      onRequestClose={() => setPopoverVisible(false)}
      placement={PopoverPlacement.BOTTOM}
      from={
        <TouchableOpacity onPress={() => setPopoverVisible(!isPopoverVisible)}>
          <FontAwesome name="navicon" color="#073040" size={24} />
        </TouchableOpacity>
      }
      arrowSize={{ width: 10, height: 5 }}
    >
      <View style={styles.popoverContent}>
        <TouchableOpacity onPress={handleUpdateClick} style={styles.option}>
          <FontAwesome
            name="pencil-square"
            color="#073040"
            size={16}
            style={tw`pr-3`}
          />
          <Text>Modifier</Text>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }} />
        <TouchableOpacity onPress={handleDeleteClick} style={styles.option}>
          <FontAwesome
            name="trash"
            color="#073040"
            size={20}
            style={[tw`pr-3`, { color: '#DC143C' }]}
          />
          <Text style={{ color: '#DC143C' }}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Popover>
  );
}

const styles = StyleSheet.create({
  popoverContent: {
    flexDirection: 'column',
  },
  option: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

//CODE AVEC POPUP

// import React from 'react';
// import { Text, View, StyleSheet } from 'react-native';
// import {
//   Menu,
//   MenuProvider,
//   MenuOptions,
//   MenuOption,
//   MenuTrigger,
// } from 'react-native-popup-menu';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// export default function ButtonUD() {
//   return (
//     <MenuProvider>
//       <Menu>
//         <MenuTrigger>
//           <FontAwesome name="navicon" color="#073040" size={24} />
//         </MenuTrigger>

//         <MenuOptions>
//           <MenuOption value={'Login'}>
//             <Text>Update</Text>
//           </MenuOption>
//           <MenuOption value={'Register'}>
//             <Text>Delete</Text>
//           </MenuOption>
//         </MenuOptions>
//       </Menu>
//     </MenuProvider>
//   );
// }

//CODE AVEC PAPER

// import React, { useState } from 'react';
// import { Text, View } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { Button, Menu, Divider, Provider } from 'react-native-paper';
// import tw from 'twrnc';

// export default function ButtonUD() {
//   const [visible, setVisible] = useState(false);

//   const openMenu = () => setVisible(true);

//   const closeMenu = () => setVisible(false);

//   return (
//     <Provider>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'center',
//         }}
//       >
//         <Menu
//           visible={visible}
//           onDismiss={closeMenu}
//           anchor={
//             <FontAwesome
//               name="navicon"
//               color="#073040"
//               size={24}
//               onPress={openMenu}
//             />
//           }
//           placement="bottom"
//         >
//           <Menu.Item onPress={() => {}} title="Item 1" />
//           <Menu.Item onPress={() => {}} title="Item 2" />
//         </Menu>
//       </View>
//     </Provider>
//   );
// }
