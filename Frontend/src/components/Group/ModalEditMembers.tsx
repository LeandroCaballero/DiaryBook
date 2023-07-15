import {
  SafeAreaView,
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
  Alert,
} from "react-native"
import React from "react"
import {
  XMarkIcon,
  UserMinusIcon,
  PencilIcon,
  CheckIcon,
} from "react-native-heroicons/outline"
import { Group } from "../../interfaces/prisma.interfaces"
import { API_URL } from "../../../config"
import Toast from "react-native-toast-message"

interface Props {
  group: Group
  show: boolean
  closeModal: () => void
  navigation: any
}

const ModalEditMembers = ({ group, show, closeModal, navigation }: Props) => {
  const actionMember = async (
    message: string,
    userId: number,
    action: string
  ) => {
    Alert.alert("Cuidado", message, [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Aceptar",
        onPress: async () => {
          try {
            // setLoading(true)
            const response = await fetch(`${API_URL}/${action}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                groupId: group.id,
              }),
            })

            const responseToJSON = await response.json()

            if (response?.ok) {
              // console.log("todo ok")
              Toast.show({
                type: "success",
                text1: "Excelente!",
                text2: responseToJSON.message,
              })
              navigation.navigate("Home")
              // closeModal()
            }
          } catch (error: any) {
            // setLoading(false)
            console.log("ERROR", error)
            Toast.show({
              type: "error",
              text1: "Hubo un error",
              text2: error.message,
            })
          }
        },
      },
    ])
  }

  return (
    <Modal
      animationType="fade"
      visible={show}
      onRequestClose={() => (show = false)}
    >
      <SafeAreaView className="h-screen flex flex-col p-3">
        <ScrollView>
          {/* Members */}
          <View className="flex flex-row justify-between">
            <Text className="text-lg">Miembros (no administradores)</Text>
            <Pressable onPress={closeModal}>
              <XMarkIcon size={30} color="#000000" />
            </Pressable>
          </View>
          {group.Users.length > 0 ? (
            group.Users.map((user) => {
              return (
                <View
                  key={user.id}
                  className="flex flex-row justify-between items-center rounded-md border border-gray-500 p-2 my-2"
                >
                  <View>
                    <Text>{user.name}</Text>
                    <Text>Miembro</Text>
                  </View>
                  <View className="flex flex-row gap-x-3">
                    <Pressable
                      className="border border-yellow-500 rounded-md p-1"
                      onPress={() =>
                        actionMember(
                          `Hacer administrador a ${user.name} del grupo?`,
                          user.id,
                          "addAdmin"
                        )
                      }
                    >
                      <PencilIcon size={30} color="#000000" />
                    </Pressable>
                    <Pressable
                      className="border border-red-500 rounded-md p-1"
                      // disabled={!isAdmin}
                      onPress={() =>
                        actionMember(
                          `Eliminar a ${user.name} del grupo?`,
                          user.id,
                          "deleteMember"
                        )
                      }
                    >
                      <UserMinusIcon size={30} color="#000000" />
                    </Pressable>
                  </View>
                </View>
              )
            })
          ) : (
            <Text>Sin resultados</Text>
          )}

          {/* Requests */}
          <Text className="text-lg">Solicitudes</Text>

          {group.RequestUsers.map((user) => {
            return (
              <View
                key={user.id}
                className="flex flex-row justify-between items-center rounded-md border border-gray-500 p-2 my-2"
              >
                <View>
                  <Text>{user.name}</Text>
                </View>
                <View className="flex flex-row gap-x-3">
                  <Pressable
                    className="border border-yellow-500 rounded-md p-1"
                    onPress={() =>
                      actionMember(
                        `Aceptar a ${user.name} en el grupo?`,
                        user.id,
                        "acceptMember"
                      )
                    }
                  >
                    <CheckIcon size={30} color="#000000" />
                  </Pressable>
                  <Pressable
                    className="border border-red-500 rounded-md p-1"
                    // disabled={!isAdmin}
                    onPress={() =>
                      actionMember(
                        `Rechazar la solicitud de ${user.name}?`,
                        user.id,
                        "rejectMember"
                      )
                    }
                  >
                    <XMarkIcon size={30} color="#000000" />
                  </Pressable>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default ModalEditMembers
