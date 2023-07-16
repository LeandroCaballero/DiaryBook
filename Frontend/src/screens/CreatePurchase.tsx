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
import { API_URL } from "../../config"
import Toast from "react-native-toast-message"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../types"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

  // User shared
  const [sharedUsers, setSharedUsers] = useState<
    Array<{ user: User; checked: boolean }>
  >([])

  const [modalEditNewItem, setModalEditNewItem] = useState<{
    index: number
    state: boolean
  }>({
    index: 0,
    state: false,
  })

  const [showNewPurchaseItem, setShowNewPurchaseItem] = useState(false)
  const [newPurchaseItem, setNewPurchaseItem] = useState<NewPurchaseItem>({
    name: "",
    quantity: "0",
    forUsers: [],
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

  useEffect(() => {
    // fetchData()

    let usersData = group.Admins.concat(group.Users).map((user) => ({
      user,
      checked: false,
    }))
    setSharedUsers(usersData)
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

  const onChangeDate = (e: DateTimePickerEvent) => {
    setDate(new Date(e.nativeEvent.timestamp || ""))
    setShowCalendar(false)
  }

  const showDatepicker = () => {
    setShowCalendar(true)
  }
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const toggleSwitchUserShared = (checked: boolean, indexUser: number) => {
    // setSharedUsers((prevUsers) => {
    //   const newArray = [...prevUsers]
    //   newArray[i] = { ...newArray[i], checked }
    //   return newArray
    // })

    setData((prevData) => {
      const prevPurchaseItemToEdit = prevData.purchaseItems

      prevPurchaseItemToEdit[modalEditNewItem.index].forUsers[indexUser] = {
        user: prevPurchaseItemToEdit[modalEditNewItem.index].forUsers[indexUser]
          .user,
        checked,
      }

      console.log("INDEX", modalEditNewItem.index, indexUser)
      console.log(prevPurchaseItemToEdit[modalEditNewItem.index].forUsers)

      return { ...prevData, purchaseItems: prevPurchaseItemToEdit }
    })
  }

  const changeNewItemInfo = (text: string, property: string) => {
    setData((prevData) => {
      const newArray = [...prevData.purchaseItems]
      newArray[modalEditNewItem.index] = {
        ...newArray[modalEditNewItem.index],
        [property]: text,
      }
      return { ...prevData, purchaseItems: newArray }
    })
  }

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
      forUsers: [],
      price: "0",
    })
  }

  const deletePurchaceItem = (index: number) => {
    console.log(index)
    setData({
      ...data,
      purchaseItems: data.purchaseItems.splice(index, 1),
    })
  }

  const editPurchaceItem = (item: NewPurchaseItem) => {
    console.log(item)
    // setData({
    //   ...data,
    //   purchaseItems: data.purchaseItems.splice(index, 1),
    // })
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
          forUsers: sharedUsers,
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
          Fecha de la compra: {dayjs(date).format("DD [de] MMMM")}
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
                onPress={() => setModalEditNewItem({ index, state: true })}
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
            value={date}
            mode="date"
            onChange={(e) => onChangeDate(e)}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditNewItem.state}
          onRequestClose={() => setModalEditNewItem({ state: false, index: 0 })}
        >
          <View
            className="flex flex-row items-center justify-center h-screen p-1"
            style={styles.modalEditNewItem}
          >
            <View className="bg-white rounded-lg p-2 w-11/12">
              <Text className="text-lg text-center">Editar Item</Text>
              <Text>Nombre</Text>
              <TextInput
                onChangeText={(e) => changeNewItemInfo(e, "name")}
                value={data.purchaseItems[modalEditNewItem.index]?.name}
                placeholder="Ingrese un nombre..."
                className="p-1 mt-1 rounded-lg bg-gray-50"
              />
              <Text>Precio</Text>
              <TextInput
                onChangeText={(e) => changeNewItemInfo(e, "price")}
                value={data.purchaseItems[
                  modalEditNewItem.index
                ]?.price.toString()}
                className="p-1 mt-1 rounded-lg bg-gray-50"
                keyboardType="numeric"
              />
              <Text>Cantidad</Text>
              <TextInput
                onChangeText={(e) => changeNewItemInfo(e, "quantity")}
                value={data.purchaseItems[
                  modalEditNewItem.index
                ]?.quantity.toString()}
                className="p-1 mt-1 rounded-lg bg-gray-50"
                keyboardType="numeric"
              />

              {data.purchaseItems[modalEditNewItem.index]?.forUsers && (
                <View className="mt-1.5">
                  <Text>Para quien es?</Text>
                  <View className="flex gap-y-1.5 mt-1">
                    {data.purchaseItems[modalEditNewItem.index]?.forUsers.map(
                      (el, i) => (
                        <View
                          key={i}
                          className="flex flex-row justify-between items-center border"
                        >
                          <Text className="pl-3">
                            {el.user.name == userInfo?.name
                              ? "Para mi"
                              : el.user.name}
                          </Text>
                          <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(checked) =>
                              toggleSwitchUserShared(checked, i)
                            }
                            value={el.checked}
                          />
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
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
  modalEditNewItem: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Color de fondo transparente con opacidad
    justifyContent: "center",
    alignItems: "center",
  },
})

export default CreatePurchase
