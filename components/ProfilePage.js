import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker/src/ImagePicker';
import { Asset } from 'expo-asset';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

const ProfilePage = () => {
  const [userType, setUserType] = useState('alumni');
  const [name, setName] = useState('John Doe');
  const [profilePhoto, setProfilePhoto] = useState(
    require('../assets/job.jpg')
  ); // Initially set to 'job.jpg'
  const [rollNo, setRollNo] = useState('12345');
  const [companyName, setCompanyName] = useState('ABC Corporation');
  const [currentRole, setCurrentRole] = useState('Software Developer');
  const [batch, setBatch] = useState('2018');
  const [favoriteDomains, setFavoriteDomains] = useState(
    'Software Development'
  );
  const [rolesToGetPlacedFor, setRolesToGetPlacedFor] =
    useState('Software Engineer');
  const [favoriteCompanies, setFavoriteCompanies] =
    useState('Google, Microsoft');
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingProfilePicture, setIsViewingProfilePicture] = useState(false);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);

  const handleProfilePicturePress = () => {
    setIsViewingProfilePicture(true);
  };

  const handleEditProfilePicture = () => {
    Alert.alert(
      'Choose an option',
      '',
      [
        {
          text: 'Camera',
          onPress: () => handleCamera(),
          icon: 'photo-camera',
        },
        {
          text: 'Gallery',
          onPress: () => showImagePicker(),
          icon: 'photo-library',
        },
      ],
      { cancelable: true }
    );
  };

  const showImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need media library permissions to make this work!'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log('result', result);
    if (!result.canceled) {
      console.log(result.assets[0].uri);
      if (result.assets[0].uri) {
        console.log('hello');
        try {
          const uri = result.assets[0].uri;
          const croppedImage = await manipulateAsync(
            uri,
            [{ resize: { width: 200, height: 200 } }],
            { compress: 1, format: SaveFormat.PNG }
          );
          setProfilePhoto({ uri: croppedImage.uri }); // Update the profile photo state with the cropped image URI
        } catch (error) {
          console.log(error);
        }
      }
      // try {
      //   const uri = result.assets[0].uri;
      //   console.log(uri);
      //   const fileNameStart = uri.lastIndexOf('/') + 1;
      //   const fileName = uri.substring(fileNameStart);
      //   console.log('File Name:', fileName);
      //   const croppedImage = await ImageManipulator.manipulateAsync(
      //     uri,
      //     [{ resize: { width: 200 } }],
      //     { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      //   );
      //   console.log('hello');
      //   console.log('cropped', croppedImage);
      //   setProfilePhoto({ uri: croppedImage.uri });
      // } catch (error) {
      //   console.log(error);
      // }
    }
    setIsEditingProfilePicture(false);
    setIsViewingProfilePicture(false);
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need camera permissions to make this work!'
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePhoto({ uri: result.uri });
    }
    setIsEditingProfilePicture(false);
    setIsViewingProfilePicture(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save the updated profile details here
  };

  const renderTextInput = (label, value, onChangeText) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#A9A9A9"
        value={value}
        onChangeText={onChangeText}
        editable={isEditing}
      />
    </View>
  );
  console.log(profilePhoto);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={handleProfilePicturePress}
          style={styles.profileImageContainer}
        >
          <Image
            source={profilePhoto} // Updated to use dynamic profile photo
            style={styles.profileImage}
          />
          {isViewingProfilePicture && (
            <>
              <TouchableOpacity
                style={styles.editIconTopLeft}
                onPress={handleEditProfilePicture}
              >
                <MaterialIcons name="edit" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeIconTopRight}
                onPress={() => setIsViewingProfilePicture(false)}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputFieldsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
        {renderTextInput('Name', name, setName)}
        {renderTextInput('Roll Number', rollNo, setRollNo)}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Type</Text>
          <Picker
            style={styles.picker}
            selectedValue={userType}
            onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
            enabled={isEditing}
          >
            <Picker.Item label="Alumni" value="alumni" />
            <Picker.Item label="Student" value="student" />
          </Picker>
        </View>
        {userType === 'student' ? (
          <View>
            {renderTextInput(
              'Favorite Domains',
              favoriteDomains,
              setFavoriteDomains
            )}
            {renderTextInput(
              'Roles to Get Placed For',
              rolesToGetPlacedFor,
              setRolesToGetPlacedFor
            )}
            {renderTextInput(
              'Favorite Companies',
              favoriteCompanies,
              setFavoriteCompanies
            )}
          </View>
        ) : (
          <View style={styles.companyView}>
            {renderTextInput('Company Name', companyName, setCompanyName)}
            {renderTextInput('Current Role', currentRole, setCurrentRole)}
            {renderTextInput('Batch', batch, setBatch)}
          </View>
        )}

        {isEditing && (
          <Button
            title="Save"
            onPress={handleSave}
            style={styles.SaveButton}
            color="#6A5ACD"
          />
        )}
      </View>

      <Modal visible={isViewingProfilePicture} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setIsViewingProfilePicture(false)}
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editIconInModal}
            onPress={handleEditProfilePicture}
          >
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={profilePhoto} // Updated to use dynamic profile photo
            style={styles.viewProfileImage}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#514bb5', // Purple-ish background color
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 22,
    marginLeft: 0,
    backgroundColor: 'rgba(255, 218, 245, 0.7)', // Peach-ish background with high transparency
    borderRadius: 30,
    padding: 20,
    paddingBottom: 5,
    borderWidth: 6,
    borderColor: '#514bb5', // Border color matches the background
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ translateY: -30 }], // Move the container up for a unique shape
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editIconTopLeft: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  closeIconTopRight: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
  inputFieldsContainer: {
    backgroundColor: 'rgba(255, 218, 245, 0.8)', // Peach-ish background with high transparency for input fields
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6A5ACD', // Border color matches the background
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 230,
  },
  editButtonText: {
    marginRight: 10,
  },
  SaveButton: {
    padding: 20,
    backgroundColor: '#6A5ACD',
  },
  label: {
    position: 'absolute',
    top: -15,
    left: 20,
    color: 'darkblue', // Set label color to black for visibility
    fontSize: 16,
    paddingHorizontal: 5,
    zIndex: 1,
    borderRadius: 5,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 218, 245, 0.7)', // Set label background color to match the container background
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#6A5ACD', // Set border color to match the container background
    borderRadius: 10,
  },
  input: {
    height: 60,
    width: '100%',
    paddingHorizontal: 20,
    borderColor: 'transparent', // Set border color to transparent
    borderWidth: 0,
    borderRadius: 10,
    paddingTop: 25,
    fontSize: 18,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  editIconInModal: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  picker: {
    height: 60,
    width: '100%',
    backgroundColor: 'transparent',
    color: '#333333',
    ...Platform.select({
      ios: {
        paddingTop: 25,
      },
    }),
  },
  viewProfileImage: {
    width: '90%', // Adjusted width to 90% of screen width
    height: '60%', // Adjusted height to 60% of screen height
    resizeMode: 'contain', // Ensure the entire image is visible without stretching
    borderRadius: 20,
  },
  companyView: {
    // Added style for company details view
    marginBottom: 20,
  },
});

export default ProfilePage;
