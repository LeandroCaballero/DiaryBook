import {
  SafeAreaView,
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from "react-native"
import React from "react"
import {
  XMarkIcon,
  UserMinusIcon,
  PencilIcon,
} from "react-native-heroicons/outline"

const ModalEditMembers = ({ group, show, closeModal }) => {
  return (
    <Modal
      animationType="fade"
      visible={show}
      onRequestClose={() => (show = false)}
    >
      <SafeAreaView className="h-screen flex flex-col p-3">
        <ScrollView>
          <View className="flex flex-row justify-between">
            <Text className="text-lg">Miembros</Text>
            <Pressable onPress={closeModal}>
              <XMarkIcon size={30} color="#000000" />
            </Pressable>
          </View>
          {group.Users.map((user) => {
            let isAdmin = group.Admins.some((admin) => admin.id == user.id)
            return (
              <View
                key={user.id}
                className="flex flex-row justify-between items-center rounded-md border border-gray-500 p-2 my-2"
              >
                <View>
                  <Text>{user.name}</Text>
                  <Text>{isAdmin ? "Administrador" : "Miembro"}</Text>
                </View>
                <View className="flex flex-row gap-x-3">
                  <Pressable
                    className="border border-yellow-500 rounded-md p-1"
                    onPress={closeModal}
                  >
                    <PencilIcon size={30} color="#000000" />
                  </Pressable>
                  <Pressable
                    className="border border-red-500 rounded-md p-1"
                    disabled={!isAdmin}
                    onPress={closeModal}
                  >
                    <UserMinusIcon size={30} color="#000000" />
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
