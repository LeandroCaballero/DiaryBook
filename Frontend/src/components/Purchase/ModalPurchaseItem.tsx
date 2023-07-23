import React, { useEffect, useState } from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native"
import {
  NewPurchaseItem,
  SharedUsers,
} from "../../interfaces/createPurchases.interfaces"
import { OperationsPurchaseItem } from "../../enums"
import { Group, User } from "../../interfaces/prisma.interfaces"

interface Props {
  modalInfo: {
    visible: boolean
    data: NewPurchaseItem
    indexPurchaseItem?: number
  }
  sharedUsers: SharedUsers[]
  closeModal: (
    operation: OperationsPurchaseItem,
    purchaseItem?: NewPurchaseItem,
    indexPurchaseItem?: number
  ) => void
}

const ModalPurchaseItem = ({ modalInfo, closeModal, sharedUsers }: Props) => {
  const [formData, setFormData] = useState<NewPurchaseItem>({
    productName: "",
    quantity: "",
    forUsers: [],
    price: "",
  })

  useEffect(() => {
    if (modalInfo.data) {
      if (modalInfo.data.forUsers.length == 0) {
        // new element
        setFormData({ ...modalInfo.data, forUsers: sharedUsers })
        return
      }
      // edit element
      setFormData(modalInfo.data)
    }
  }, [modalInfo])

  //   Changes Controllers
  const changeNewItemInfo = (text: string, property: string) => {
    setFormData({ ...formData, [property]: text })
  }

  const toggleSwitchUserShared = (checked: boolean, index: number) => {
    setFormData((prevData) => {
      prevData.forUsers[index].checked = checked
      console.log("Usuario editado", prevData.forUsers[index].user.name)
      return { ...prevData }
    })
  }

  const sendCloseModal = (operation: OperationsPurchaseItem) => {
    // Clean modal form
    setFormData({
      productName: "",
      quantity: "",
      forUsers: [],
      price: "",
    })

    // Send closeModal
    operation == OperationsPurchaseItem.save
      ? closeModal(operation, formData, modalInfo.indexPurchaseItem)
      : closeModal(operation)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalInfo.visible}
      onRequestClose={() => sendCloseModal(OperationsPurchaseItem.cancel)}
    >
      <View
        className="flex flex-row items-center justify-center h-screen p-1"
        style={styles.modalEditNewItem}
      >
        <View className="bg-white rounded-lg p-2 w-11/12">
          <Text className="text-lg text-center">Editar Item</Text>
          <Text>Nombre</Text>
          <TextInput
            onChangeText={(e) => changeNewItemInfo(e, "productName")}
            value={formData.productName}
            placeholder="Ingrese un nombre..."
            className="p-1 mt-1 rounded-lg bg-gray-50"
          />
          <Text>Precio</Text>
          <TextInput
            onChangeText={(e) => changeNewItemInfo(e, "price")}
            value={formData.price.toString()}
            className="p-1 mt-1 rounded-lg bg-gray-50"
            keyboardType="numeric"
          />
          <Text>Cantidad</Text>
          <TextInput
            onChangeText={(e) => changeNewItemInfo(e, "quantity")}
            value={formData.quantity.toString()}
            className="p-1 mt-1 rounded-lg bg-gray-50"
            keyboardType="numeric"
          />

          <View className="mt-1.5">
            <Text>Para quien es?</Text>
            <View className="flex gap-y-1.5 mt-1">
              {formData.forUsers.map((el, i) => (
                <View
                  key={i}
                  className="flex flex-row justify-between items-center border"
                >
                  <Text className="pl-3">
                    {/* {el.user.name == userInfo?.name ? "Para mi" : el.user.name} */}
                    {el.user.name}
                  </Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    // thumbColor={{ false: "#f5dd4b", true: "#f4f3f4" }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(checked) =>
                      toggleSwitchUserShared(checked, i)
                    }
                    value={el.checked}
                  />
                </View>
              ))}
            </View>
          </View>
          <Pressable
            className="border border-black mt-2 rounded-lg w-1/2 mx-auto"
            onPress={() => sendCloseModal(OperationsPurchaseItem.save)}
          >
            <Text className="text-center p-2">Guardar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalEditNewItem: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Color de fondo transparente con opacidad
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ModalPurchaseItem
