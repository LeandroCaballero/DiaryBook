import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ImageBackground,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Camera, CameraType } from "expo-camera"
import React, { useState, useEffect } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import DropDownPicker from "react-native-dropdown-picker"
import dayjs from "dayjs"
// import FormData from "form-data"

import "dayjs/locale/es"
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  CameraIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/outline"
import { SafeAreaView } from "react-native-safe-area-context"
import { Group, Purchase, PurchaseItem } from "../interfaces/prisma.interfaces"
import { NewPurchaseItem } from "../interfaces/createPurchases.interfaces"
import { API_URL } from "../../config"
import Toast from "react-native-toast-message"

const CreatePurchase = () => {
  const [date, setDate] = useState(new Date())
  // const [mode, setMode] = useState("date")
  const [showCalendar, setShowCalendar] = useState(false)

  // Camera
  const [cameraRef, setCameraRef] = useState<Camera | null>()
  const [photoUri, setPhotoUri] = useState<string | undefined>()
  const [type, setType] = useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [showCamera, setShowCamera] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const [showNewPurchaseItem, setShowNewPurchaseItem] = useState(false)
  const [newPurchaseItem, setNewPurchaseItem] = useState<NewPurchaseItem>({
    name: "",
    quantity: "0",
    shared: false,
    price: "0",
  })

  const [data, setData] = useState<{
    groupId?: number
    buyerId?: number
    purchaseItems: NewPurchaseItem[]
    purchases?: Purchase[]
    name: string
    dateBuy: string
    groups?: Group[]
  }>({
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
    fetchData()
  }, [])

  const fetchData = async () => {
    // setLoading(true)
    try {
      const [groups, purchases] = await Promise.all([
        await fetch(`${API_URL}/groups`),
        await fetch(`${API_URL}/purchases`),
      ])

      const groupsJSON: Group[] = await groups.json()
      const purchasesJSON: Purchase[] = await purchases.json()

      setData({ ...data, groups: groupsJSON, purchases: purchasesJSON })
    } catch (error) {
      console.log(error)
    } finally {
      // setLoading(false)
    }
  }

  const onChangeDate = (selectedDate: Date) => {
    // const currentDate = selectedDate
    setDate(selectedDate)
    setShowCalendar(false)
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
      name: "",
      quantity: "0",
      shared: false,
      price: "0",
    })
  }

  const deletePurchaceItem = (index: number) => {
    console.log(index)
    setData({
      ...data,
      purchaseItems: data.purchaseItems.slice(index, 1),
    })
  }

  const takePicture = async () => {
    if (permission) {
      setShowCamera(true)
    } else {
      await requestPermission()
      permission
        ? setShowCamera(true)
        : Toast.show({
            type: "error",
            text1: "Hubo un error",
            text2: "Cámara denegada!",
          })
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
      setShowCamera(false)
      setShowPreviewModal(true)
      console.log("Foto tomada")
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
      const response = await fetch(`${API_URL}/test`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const responseJson = await response.json()
      // console.log(responseJson)

      const newInfo = responseJson.map((el: any) => {
        return {
          name: el.description,
          price: el.unit_price,
          quantity: el.quantity,
          shared: true,
        }
      })

      setData({ ...data, purchaseItems: newInfo })
    } catch (error) {
      console.log(error)
    } finally {
      // setLoading(false)
    }
  }

  return (
    <ScrollView className="p-3 bg-white h-full">
      <SafeAreaView>
        {/* <Text className="text-white text-2xl text-center">Cargar compra</Text> */}
        <Text className="">Nombre de la compra</Text>
        <TextInput
          onChangeText={(e) => setData({ ...data, name: e })}
          value={data.name}
          placeholder="Ingrese un nombre..."
          className=" p-1 mt-1 rounded-lg bg-gray-50"
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

        <Text className="text-white text-center text-lg">
          Items de la compra
        </Text>
        {data.purchaseItems?.map((item, index) => (
          <View
            key={index}
            className="border border-white rounded-lg flex flex-row items-center mb-2 p-2"
          >
            <View className="w-2/3">
              <Text className="text-white">Nombre: {item.name}</Text>
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
            mode="date"
            onChange={() => onChangeDate(date)}
          />
        )}

        {showNewPurchaseItem ? (
          <View className="space-y-3">
            <View>
              <Text className="">Precio</Text>
              <TextInput
                onChangeText={(e) =>
                  setNewPurchaseItem({ ...newPurchaseItem, price: e })
                }
                value={newPurchaseItem.price}
                className="rounded-lg bg-gray-50 p-1 mt-1"
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text className="">Cantidad</Text>
              <TextInput
                onChangeText={(e) =>
                  setNewPurchaseItem({ ...newPurchaseItem, quantity: e })
                }
                value={newPurchaseItem.quantity}
                className="rounded-lg bg-gray-50 p-1 mt-1"
                keyboardType="numeric"
              />
            </View>
            <View className="flex flex-col items-start">
              <Text className="">Es compartido</Text>

              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>

            {/* <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            /> */}

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
            className="border border-black"
            onPress={() => setShowNewPurchaseItem(true)}
          >
            <Text className=" p-2">Agregar</Text>
          </Pressable>
        )}

        <View className="h-full">
          <Pressable
            className="border bg-white rounded-lg p-2 my-1 w-1/2 flex flex-row justify-between"
            onPress={takePicture}
          >
            <Text className="">Foto a ticket</Text>
            <CameraIcon size={20} color="#000000" />
          </Pressable>
          <Pressable
            className="border bg-white rounded-lg p-2 my-1 w-1/2"
            onPress={sendPhoto}
          >
            <Text className="text-center">Guardar</Text>
          </Pressable>
          {/* <Image
            className="h-full"
            source={{
              uri: photoUri,
            }}
          /> */}
        </View>

        <Modal
          animationType="slide"
          // transparent={true}
          visible={showCamera}
          // onRequestClose={toggleModal}
        >
          <View className="h-full p-1">
            <Camera
              className="h-screen flex flex-col content-between justify-between"
              // className="h-screen flex justify-end items-center"
              type={type}
              ref={(ref) => setCameraRef(ref)}
            >
              <View className="flex flex-row justify-end p-2">
                {/* <Pressable
                  className="bg-white rounded-full p-3 my-1 flex items-center justify-center h-10 w-10"
                  onPress={toggleCameraType}
                >
                  <ArrowLeftIcon size={20} color="#000000" />
                </Pressable> */}
                <Pressable
                  className="bg-white rounded-full p-3 my-1 flex items-center justify-center h-10 w-10"
                  onPress={() => setShowCamera(false)}
                >
                  <XMarkIcon size={20} color="#000000" />
                </Pressable>
              </View>

              <Pressable
                className="bg-white rounded-full mx-auto p-3 mb-5 flex items-center justify-center h-20 w-20"
                onPress={takePhoto}
              >
                <CameraIcon size={40} color="#000000" />
              </Pressable>
            </Camera>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          // transparent={true}
          visible={showPreviewModal}
          // onRequestClose={()=>setShowPreviewModal(!showPreviewModal)}
        >
          <View className="h-screen flex flex-col p-3">
            <ImageBackground
              resizeMode="stretch"
              className="h-5/6 flex flex-row justify-between"
              source={{
                uri: photoUri || "",
              }}
            >
              <Pressable
                className="flex items-center justify-center h-10 w-10 border border-white bg-transparent rounded-full m-2"
                onPress={() => {
                  setShowPreviewModal(false)
                  setShowCamera(true)
                }}
              >
                <ArrowLeftIcon size={20} color="#FFFFFF" />
              </Pressable>
              {/* <Text>Enviar</Text> */}
              <Pressable
                className="flex items-center justify-center h-10 w-10 border border-white bg-transparent rounded-full m-2"
                onPress={() => setShowPreviewModal(false)}
              >
                <XMarkIcon size={20} color="#FFFFFF" />
              </Pressable>
            </ImageBackground>
            <TouchableOpacity
              className=" bg-white rounded-2xl p-2 my-1 w-1/2 mx-auto"
              style={styles.button}
              onPress={() => setShowPreviewModal(false)}
            >
              <Text className="text-center">Extraer productos</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* {!showCamera ? (
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
        )} */}
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    elevation: 3, // Añade sombra en Android
    shadowColor: "#000", // Añade sombra en iOS
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})

export default CreatePurchase
