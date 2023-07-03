import { View, Text, FlatList, TouchableOpacity } from "react-native"
import React from "react"

const GroupItem = ({ name }) => (
  <View>
    <TouchableOpacity className="border p-2 border-white rounded-md mr-3 w-24 h-24 flex flex-row justify-center items-center">
      <Text className="text-white">{name}</Text>
    </TouchableOpacity>
  </View>
)

const CarouselGroups = ({ groups }) => {
  return (
    <View className="my-2">
      {groups.lenght > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={groups}
          renderItem={({ item }) => <GroupItem name={item.name} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Sin resultados</Text>
      )}
    </View>
  )
}

export default CarouselGroups
