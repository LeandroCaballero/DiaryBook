import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import { Camera } from "expo-camera"

export default function Test() {
  const [hasPermission, setHasPermission] = useState(null)
  const [cameraRef, setCameraRef] = useState(null)
  const [photoUri, setPhotoUri] = useState(null)

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync()
      setPhotoUri(photo.uri)
    }
  }

  if (hasPermission === null) {
    return <View />
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={(ref) => setCameraRef(ref)} />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      {photoUri && <Image style={styles.photo} source={{ uri: photoUri }} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
  },
  photo: {
    marginTop: 20,
    width: 300,
    height: 400,
    alignSelf: "center",
  },
})
