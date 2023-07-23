import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native"
import { PencilSquareIcon, PlusIcon } from "react-native-heroicons/outline"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ModalEditMembers from "../components/Group/ModalEditMembers"
import { AuthStackParamList } from "../types"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

type Props = NativeStackScreenProps<AuthStackParamList, "Group">

const Group = ({ route, navigation }: Props) => {
  const { group } = route.params

  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    token: string
  }>()
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem("userInfo").then((user) =>
      setUser(JSON.parse(user || ""))
    )
  }, [])

  // const closeModal = (type: string) =>{
  //   if (type == 'actionSuccess') {
  //     setShowEditMemberModal(false)
  //     na
  //   }else{

  //   }
  // }

  return (
    <SafeAreaView className="p-3 h-full">
      <ScrollView>
        <View className="flex flex-row justify-between">
          <Text className="text-lg">Miembros</Text>

          {group.Admins.some((admin) => admin.id == user?.id) && (
            <TouchableOpacity
              className="border border-green-500 rounded-lg mb-3 py-2 px-2"
              onPress={() => setShowEditMemberModal(true)}
            >
              <PencilSquareIcon size={20} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
        {group.Admins.map((el) => (
          <View key={el.id} className="flex flex-row justify-between">
            <Text>{el.name}</Text>
            <Text className="text-green-700">Administrador</Text>
          </View>
        ))}
        {group.Users.map((el) => (
          <Text key={el.id}>{el.name}</Text>
        ))}

        <Text className="text-lg mt-3">Solicitudes</Text>
        {group.RequestUsers.length > 0 ? (
          group.RequestUsers.map((el) => <Text key={el.id}>{el.name}</Text>)
        ) : (
          <Text>Sin resultados</Text>
        )}
        <View className="flex flex-row justify-between">
          <Text className="text-lg">Compras</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("CreatePurchase", {
                group: group,
                title: "Agregar compra",
                userInfo: user,
              })
            }
            className="rounded-full border p-0.5"
          >
            <PlusIcon size={25} color="#000000" />
          </Pressable>
        </View>
        {group.Purchases.length > 0 ? (
          group.Purchases.map((el) => (
            <View key={el.id} className="flex flex-row justify-between">
              <Text>{el.name}</Text>
            </View>
          ))
        ) : (
          <Text>Sin resultados</Text>
        )}

        <ModalEditMembers
          show={showEditMemberModal}
          closeModal={() => setShowEditMemberModal(false)}
          group={group}
          navigation={navigation}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Group
