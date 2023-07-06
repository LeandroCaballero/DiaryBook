import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native"
import { PencilSquareIcon } from "react-native-heroicons/outline"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Group = ({ route }) => {
  const { group } = route.params

  const [user, setUser] = useState()

  useEffect(() => {
    AsyncStorage.getItem("userInfo").then((user) => setUser(JSON.parse(user)))
  }, [])

  return (
    <SafeAreaView className="p-3 h-full">
      <ScrollView>
        <View className="flex flex-row justify-between">
          <Text className="text-lg">Miembros</Text>
          {group.Admins.some((admin) => admin.id == user?.id) && (
            <TouchableOpacity
              className="border border-green-500 rounded-lg mb-3 py-2 px-2"
              //   onPress={() => setModalVisible(!modalVisible)}
            >
              <PencilSquareIcon size={20} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
        {group.Users.map((el) => (
          <View key={el.id} className="flex flex-row justify-between">
            <Text>{el.name}</Text>
            {group.Admins.some((admin) => admin.id == el.id) && (
              <Text className="text-green-700">Administrador</Text>
            )}
          </View>
        ))}

        <Text className="text-lg mt-2">Compras</Text>
        {group.Purchases.length != 0 ? (
          group.Purchases.map((el) => (
            <View key={el.id} className="flex flex-row justify-between">
              <Text>{el.name}</Text>
            </View>
          ))
        ) : (
          <Text>Sin resultados</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Group
