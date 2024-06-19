import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const primaryGreen = "#4CAF50";

// Clarifai API Configuration
const CLARIFAI_API_KEY = 'b3e4712750f6409884c9bfe0a12ab198';  // Replace with your Clarifai API key
const CLARIFAI_FOOD_MODEL = 'bd367be194cf45149e75f01d59f77ba7'; // Clarifai Food Model ID

export default function HomePage({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outPut, setOutPut] = useState(null);
  const [glycemicIndex, setGlycemicIndex] = useState(null);
  const [name, setName] = useState('');

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your camera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePostPhoto = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    setIsLoading(true);
    setOutPut(null);
    setGlycemicIndex(null);

    try {
      const base64Image = await convertImageToBase64(imageUri);

      const response = await fetch(
        'https://api.clarifai.com/v2/models/' + CLARIFAI_FOOD_MODEL + '/outputs',
        {
          method: 'POST',
          headers: {
            'Authorization': `Key ${CLARIFAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: [
              {
                data: {
                  image: {
                    base64: base64Image
                  }
                }
              }
            ]
          })
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        const detectedFoodItem = responseData.outputs[0].data.concepts[0].name;
        setOutPut(detectedFoodItem);
        setName(detectedFoodItem);

        const glycemicIndex = await fetchGlycemicIndexFromAPI(detectedFoodItem);
        setGlycemicIndex(glycemicIndex);
        console.log(glycemicIndex);

        if (glycemicIndex !== null) {
          

          Alert.alert('Success', `Image classification successful! Detected: ${detectedFoodItem}. Glycemic Index: ${glycemicIndex}`);
        } else {
          Alert.alert('Info', `Image classification successful! Detected: ${detectedFoodItem}. Glycemic Index not found.`);
        }

      } else {
        Alert.alert('Error', 'Image classification failed. Please try again.');
        console.log(responseData);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while classifying the image. Please try again later.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fetchGlycemicIndexFromAPI = async (foodItem) => {
    try {
      const response = await fetch('http://178.62.207.33:8888/api/v2/glycemics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: foodItem }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        return data.glycemic.index;
      } else {
        console.log('API response error:', data);
        return null;
      }
    } catch (error) {
      console.log('Error fetching glycemic index from API:', error);
      return null;
    }
  };

 

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.body}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.descriptionText}>
              Capture or select an image to detect the glycemic index of the food.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
                <Text style={styles.buttonText}>Choose Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
            {imageUri && (
              <>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.postButton}
                  onPress={handlePostPhoto}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.postButtonText}>Post Photo</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
            {outPut && glycemicIndex !== null && (
              <View style={styles.resultContainer}>
                <View style={styles.resultCard}>
                  <Text style={styles.resultText}>Detected Food Item:</Text>
                  <Text style={styles.foodItemText}>{outPut}</Text>
                  <Text style={styles.resultText}>Glycemic Index:</Text>
                  <Text style={styles.glycemicIndexText}>{glycemicIndex}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  body: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: primaryGreen,
    borderRadius: 25,
    height: 50,
    width: '40%',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: primaryGreen,
    borderRadius: 25,
    height: 50,
    width: '80%',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#333',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  foodItemText: {
    fontSize: 20,
    color: primaryGreen,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  glycemicIndexText: {
    fontSize: 20,
    color: primaryGreen,
    fontWeight: 'bold',
  },
});
