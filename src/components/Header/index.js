import React from 'react';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {useWindowDimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

export default function index({navigation, title}) {
  // const [showNav, setShowNav] = useState(false);
  // const dimensions = useWindowDimensions();

  const openMenu = () => {
    navigation.toggleDrawer();
  };
  return (
    <Header
      backgroundColor="#f75b5b"
      statusBarProps={{barStyle: 'light-content'}}
      leftComponent={
        <Icon
          name="bars"
          size={24}
          color="white"
          onPress={() => {
            openMenu();
          }}
        />
      }
      centerComponent={{text: title, style: {color: 'white'}}}
      placement="center"
      // rightComponent={<Icon
      //   name='user'
      //   size={24}
      //   color='white' />}
    ></Header>
  );
}
