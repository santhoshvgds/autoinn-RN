import React, {useState} from 'react';
import axios from 'axios';
import {PermissionsAndroid} from 'react-native';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Avatar, Button} from 'react-native-elements';
// import * as ImagePicker from 'expo-image-picker';
import ImagePicker from 'react-native-image-picker';
// import * as Permissions from 'expo-permissions';
const imageupload = (props) => {
  const [pickedImage, setPickedImage] = useState(props.ImageURL);
  const verifyPermissions = async () => {
    PermissionsAndroid.check('camera').then((response) => {
      if (response === false) {
        //Open scanner
        Alert.alert(
          'Insufficient permissions!',
          'You need to grant camera permissions to use this app.',
          [{text: 'Okay'}],
        );
        return false;
      }
      return true;
    });
  };

  const takeImageGallery = async () => {
    try {
      let options = {
        title: 'Select Image',
        mediaTypes: 'image',
        allowsEditing: true,
        quality: 1,
      };
      ImagePicker.launchImageLibrary(options, (response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setPickedImage(response.uri);
          props.onImageTaken(response.uri);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const takeDummy = () => {
    return 0;
  };
  const takeImageCamera = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    let options = {
      title: 'Select Image',
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    };
    ImagePicker.launchCamera(options, (res) => {
      // console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        setPickedImage(res.uri);
        props.onImageTaken(res.uri);
      }
    });
  };
  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View style={{marginTop: 18}}>
          {!pickedImage ? (
            <Avatar
              size={150}
              rounded
              overlayContainerStyle={{backgroundColor: 'grey'}}
              icon={{name: 'user', type: 'font-awesome'}}
              // onPress={takeImageCamera}
              containerStyle={{margin: 'auto'}}
              // showAccessory
            />
          ) : (
            <Avatar
              size={150}
              rounded
              source={{
                uri: pickedImage,
              }}
              containerStyle={{margin: 'auto'}}
              showAccessory
              onAccessoryPress={props.view ? takeDummy : takeImageCamera}
            />
          )}
        </View>
        {!props.view ? (
          <View style={styles.imagePicker}>
            <Button
              disabled={props.view}
              style={[styles.button]}
              buttonStyle={{backgroundColor: '#f75b5b'}}
              onPress={takeImageCamera}
              title="Take Picture"></Button>
            <Button
              disabled={props.view}
              style={[styles.button]}
              buttonStyle={{backgroundColor: '#f75b5b'}}
              onPress={takeImageGallery}
              title="Camera Roll"></Button>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};
export default imageupload;
const styles = StyleSheet.create({
  imagePicker: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBorder: {
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    width: 70,
    height: 70,
    backgroundColor: 'grey',
  },
  button: {
    marginTop: 20,
  },
});
