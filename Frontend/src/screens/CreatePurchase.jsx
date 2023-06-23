import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Switch,
  ToastAndroid,
  Image,
} from "react-native"
import { Camera, CameraType } from "expo-camera"
import React, { useState, useEffect } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import DropDownPicker from "react-native-dropdown-picker"
import dayjs from "dayjs"
// import FormData from "form-data"

import "dayjs/locale/es"
import { CheckIcon, XMarkIcon } from "react-native-heroicons/outline"

const CreatePurchase = () => {
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState("date")
  const [showCalendar, setShowCalendar] = useState(false)

  // Camera
  const [cameraRef, setCameraRef] = useState(null)
  const [photoUri, setPhotoUri] = useState(null)
  const [type, setType] = useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [showCamera, setShowCamera] = useState(false)

  const [showNewPurchaseItem, setShowNewPurchaseItem] = useState(false)
  const [newPurchaseItem, setNewPurchaseItem] = useState({
    quantity: "0",
    shared: false,
    price: "0",
  })

  const [data, setData] = useState({
    groupId: null,
    buyerId: null,
    purchaseItems: [],
    name: "",
    dateBuy: "",
  })

  // Dropdown
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ])

  useEffect(() => {
    // console.log(data)
    fetchData()
  }, [])

  const fetchData = async () => {
    // setLoading(true)
    try {
      const [groups, purchases] = await Promise.all([
        await fetch("http://192.168.0.14:3001/groups"),
        await fetch("http://192.168.0.14:3001/purchases"),
      ])

      const groupsJSON = await groups.json()
      const purchasesJSON = await purchases.json()

      setData({ groups: groupsJSON, purchases: purchasesJSON })
    } catch (error) {
      console.log(error)
    } finally {
      // setLoading(false)
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShowCalendar(false)
    setDate(currentDate)
  }

  const showDatepicker = () => {
    setShowCalendar(true)
  }
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const savePurchaseItem = () => {
    setData({
      ...data,
      purchaseItems: [...data.purchaseItems, newPurchaseItem],
    })
    clearNewPurchaseItem()
  }

  const cancelPurchaseItem = () => {
    setShowNewPurchaseItem(false)
    clearNewPurchaseItem()
  }

  const clearNewPurchaseItem = () => {
    setNewPurchaseItem({
      quantity: "0",
      shared: false,
      price: "0",
    })
  }

  const deletePurchaceItem = (index) => {
    console.log(index)
    setData({
      ...data,
      purchaseItems: data.purchaseItems.slice(index, 1),
    })
  }

  const takePicture = async () => {
    // ToastAndroid.show("Test", ToastAndroid.SHORT)
    if (permission) {
      setShowCamera(true)
    } else {
      await requestPermission()
      permission
        ? setShowCamera(true)
        : ToastAndroid.show("Cámara denegada!", ToastAndroid.SHORT)
    }
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    )
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync()
      // console.log(photo)
      setPhotoUri(photo.uri)
    }
  }

  const sendPhoto = async () => {
    let formData = new FormData()
    formData.append("photo", {
      uri: photoUri,
      name: "photo.jpg",
      type: "image/jpeg",
    })

    // console.log(formData)

    try {
      const response = await fetch("http://192.168.0.14:3001/test", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const responseJson = await response.json()
      console.log(responseJson)
    } catch (error) {
      console.log(error)
    } finally {
      // setLoading(false)
    }

    // await fetch("http://localhost:3001/test", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Use the data from the server here
    //     console.log(data)
    //   })
    //   .catch((error) => {
    //     // Handle any errors that occur
    //     console.error(error)
    //   })
  }

  return (
    <View className="p-3 h-full bg-blue-800">
      <Text className="text-white text-2xl text-center">Cargar compra</Text>
      <Text className="text-white">Nombre de la compra</Text>
      <TextInput
        onChangeText={(e) => setData({ ...data, name: e })}
        value={data.name}
        className="border border-white text-white p-1 mt-1"
      />
      <Text className="text-white">
        Fecha de la compra: {dayjs(date).format("DD [de] MMMM")}
      </Text>
      <Pressable
        className="border bg-white rounded-lg p-2 my-1 w-1/2"
        onPress={() => setShowCalendar(true)}
      >
        <Text className="text-center">Seleccionar fecha</Text>
      </Pressable>

      <Text className="text-white text-center text-lg">Items de la compra</Text>
      {data.purchaseItems?.map((item, index) => (
        <View
          key={index}
          className="border border-white rounded-lg flex flex-row items-center"
        >
          <View className="w-2/3">
            <Text className="text-white">Precio: {item.price}</Text>
            <Text className="text-white">Cantidad: {item.quantity}</Text>
            <Text className="text-white">
              Compartido{item.shared ? "Si" : "No"}
            </Text>
          </View>
          <View className="w-1/3">
            <Pressable
              className="ml-auto mr-2 bg-white  rounded-full p-3 my-1 w-12 flex flex-row items-center justify-center"
              onPress={() => deletePurchaceItem(index)}
            >
              <XMarkIcon size={20} color="#000000" />
            </Pressable>
          </View>
        </View>
      ))}

      {showCalendar && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          onChange={onChange}
        />
      )}

      {showNewPurchaseItem ? (
        <View className="space-y-3">
          <View>
            <Text className="text-white">Precio</Text>
            <TextInput
              onChangeText={(e) =>
                setNewPurchaseItem({ ...newPurchaseItem, price: e })
              }
              value={newPurchaseItem.price}
              className="border border-white text-white p-1 mt-1"
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text className="text-white">Cantidad</Text>
            <TextInput
              onChangeText={(e) =>
                setNewPurchaseItem({ ...newPurchaseItem, quantity: e })
              }
              value={newPurchaseItem.quantity}
              className="border border-white text-white p-1 mt-1"
              keyboardType="numeric"
            />
          </View>
          <View className="flex flex-col items-start">
            <Text className="text-white">Es compartido</Text>

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />

          <View className="flex flex-row">
            <Pressable
              className="border bg-white rounded-full p-3 my-1 w-12 flex flex-row items-center justify-center"
              onPress={savePurchaseItem}
            >
              <CheckIcon size={20} color="#000000" />
            </Pressable>

            <Pressable
              className="border bg-white rounded-full p-3 my-1 w-12 flex flex-row items-center justify-center"
              onPress={cancelPurchaseItem}
            >
              <XMarkIcon size={20} color="#000000" />
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          className="border border-white"
          onPress={() => setShowNewPurchaseItem(true)}
        >
          <Text className="text-white p-2">Agregar</Text>
        </Pressable>
      )}

      {!showCamera ? (
        <View className="h-full">
          <Pressable
            className="border bg-white rounded-lg p-2 my-1 w-1/2"
            onPress={takePicture}
          >
            <Text className="text-center">Foto a ticket</Text>
          </Pressable>
          <Pressable
            className="border bg-white rounded-lg p-2 my-1 w-1/2"
            onPress={sendPhoto}
          >
            <Text className="text-center">Enviar</Text>
          </Pressable>
          <Image
            className="h-full"
            source={{
              uri: photoUri,
            }}
          />
        </View>
      ) : (
        <View className="h-full">
          <Camera
            className="h-screen"
            type={type}
            ref={(ref) => setCameraRef(ref)}
          >
            <View>
              <Pressable onPress={takePhoto}>
                <Text className="text-white text-lg">Tomar</Text>
              </Pressable>
              <Pressable onPress={toggleCameraType}>
                <Text className="text-white text-lg">Flip Camera</Text>
              </Pressable>
              <Pressable onPress={() => setShowCamera(false)}>
                <Text className="text-white text-lg">Cancelar</Text>
              </Pressable>
            </View>
          </Camera>
        </View>
      )}
    </View>
  )
}

export default CreatePurchase
