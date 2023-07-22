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
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
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
  PencilIcon,
} from "react-native-heroicons/outline"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  Group,
  Purchase,
  PurchaseItem,
  User,
} from "../interfaces/prisma.interfaces"
import { NewPurchaseItem } from "../interfaces/createPurchases.interfaces"
import ModalPurchaseItem from "../components/Purchase/ModalPurchaseItem"
import { API_URL } from "../../config"
import Toast from "react-native-toast-message"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { OperationsPurchaseItem } from "../enums"

let dataTest = [
  {
    description: "LECHE LECHE DESCRE (21.00%) UAT CARREFOUR",
    quantity: 2,
    unit_price: 335,
  },
  {
    description: "LECHE CLASICO LA SERENISIMA",
    quantity: 1,
    unit_price: 306.92,
  },
  {
    description: "CLASICAS (21.00%) MEDIATARDE 3 X 1",
    quantity: 1,
    unit_price: 277.14,
  },
  {
    description: "Bebidas COMUN DONA (21.00%) DULCE X 1 NARANJA KG BANANA X 18",
    quantity: 1,
    unit_price: 284.01,
  },
  {
    description: "MEDALLON CV X 110 GRS.",
    quantity: 1,
    unit_price: 342,
  },
]

type Props = NativeStackScreenProps<AuthStackParamList, "CreatePurchase">

const CreatePurchase = ({
  route: {
    params: { group, userInfo },
  },
}: Props) => {
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

  const [modalPurchaseItem, setModalPurchaseItem] = useState<{
    visible: boolean
    data: NewPurchaseItem
    indexPurchaseItem?: number
  }>({
    visible: false,
    data: {
      forUsers: [],
      name: "",
      price: "",
      quantity: "",
    },
  })

  const [data, setData] = useState<{
    groupId?: number
    buyerId?: number
    purchaseItems: NewPurchaseItem[]
    purchases?: Purchase[]
    name: string
    dateBuy: Date
    groups?: Group[]
  }>({
    purchaseItems: [],
    name: "",
    dateBuy: new Date(),
  })

  const onChangeDate = (e: DateTimePickerEvent) => {
    setShowCalendar(false)
    if (e.nativeEvent.timestamp)
      setData({ ...data, dateBuy: new Date(e.nativeEvent.timestamp) })
  }

  const deletePurchaceItem = (index: number) => {
    console.log(index)
    setData({
      ...data,
      purchaseItems: data.purchaseItems.splice(index, 1),
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
    // let formData = new FormData()
    // formData.append("photo", {
    //   uri: photoUri,
    //   name: "photo.jpg",
    //   type: "image/jpeg",
    // })

    try {
      // const response = await fetch(`${API_URL}/test`, {
      //   method: "POST",
      //   body: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // })

      // const responseJson = await response.json()

      const newInfo = dataTest.map((el: any, index) => {
        return {
          id: index,
          name: el.description,
          price: el.unit_price,
          quantity: el.quantity,
          forUsers: [],
        }
      })

      // const newInfo = responseJson.map((el: any) => {
      //   return {
      //     name: el.description,
      //     price: el.unit_price,
      //     quantity: el.quantity,
      //     shared: true,
      //   }
      // })

      setData({ ...data, purchaseItems: newInfo })
    } catch (error) {
      console.log(error)
    } finally {
      // setLoading(false)
    }
  }

  const closeModalPurchaseItem = (
    operation: OperationsPurchaseItem,
    purchaseItem?: NewPurchaseItem,
    indexPurchaseItem?: number
  ) => {
    if (operation == OperationsPurchaseItem.save && purchaseItem) {
      const { purchaseItems } = data
      console.log("info", operation, indexPurchaseItem)
      // If is create
      // Algo interesante, 0 es falso en JS por eso cuando editaba el primer elemento con indice 0, !indexPurchaseItem es igual a true
      if (!indexPurchaseItem && indexPurchaseItem != 0) {
        console.log("entra en CREATE")
        setData({ ...data, purchaseItems: [...purchaseItems, purchaseItem] })
      } else {
        // Edit
        console.log("entra en EDIT")
        setData((prevData) => {
          prevData.purchaseItems[indexPurchaseItem] = purchaseItem
          return { ...prevData }
        })
      }
    }

    setModalPurchaseItem({
      visible: false,
      data: {
        forUsers: [],
        name: "",
        price: "",
        quantity: "",
      },
    })
  }

  return (
    <ScrollView className="p-3 bg-white h-full">
      <SafeAreaView>
        <Text>Nombre de la compra</Text>
        <TextInput
          onChangeText={(e) => setData({ ...data, name: e })}
          value={data.name}
          placeholder="Ingrese un nombre..."
          className=" p-1 mt-1 rounded-lg bg-gray-50"
        />
        <Text className="">
          Fecha de la compra: {dayjs(data.dateBuy).format("DD [de] MMMM")}
        </Text>
        <Pressable
          className="border bg-white rounded-lg p-2 my-1 w-1/2"
          onPress={() => setShowCalendar(true)}
        >
          <Text className="text-center">Seleccionar fecha</Text>
        </Pressable>

        <Text className="text-center text-lg">Items de la compra</Text>
        {data.purchaseItems?.map((item, index) => (
          <View
            key={index}
            className="border  rounded-lg flex flex-row items-center mb-2 p-2"
          >
            <View className="w-2/3">
              <Text className="">Nombre: {item.name}</Text>
              <Text className="">Precio: {item.price}</Text>
              <Text className="">Cantidad: {item.quantity}</Text>
              <Text className="">
                Compartido{item.forUsers.length > 0 ? "Si" : "No"}
              </Text>
            </View>
            <View className="w-1/3 flex flex-row">
              <Pressable
                className="ml-auto mr-2 bg-white  rounded-full p-3 my-1 w-12 flex flex-row items-center justify-center"
                onPress={() =>
                  setModalPurchaseItem({
                    visible: true,
                    data: item,
                    indexPurchaseItem: index,
                  })
                }
              >
                <PencilIcon size={20} color="#000000" />
              </Pressable>
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
            value={data.dateBuy}
            mode="date"
            onChange={(e) => onChangeDate(e)}
          />
        )}
        <Pressable
          className="border border-black"
          onPress={() =>
            setModalPurchaseItem({ ...modalPurchaseItem, visible: true })
          }
        >
          <Text className=" p-2">Agregar</Text>
        </Pressable>

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
        </View>

        {/* Modal camera */}
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

        {/* Modal preview picture */}
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

        {/* Edit item modal */}
        <ModalPurchaseItem
          closeModal={closeModalPurchaseItem}
          modalInfo={modalPurchaseItem}
          sharedUsers={group.Admins.concat(group.Users).map((user) => ({
            user,
            checked: false,
          }))}
        />
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
