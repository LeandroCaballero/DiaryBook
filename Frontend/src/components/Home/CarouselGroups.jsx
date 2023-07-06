import { View, Text, FlatList, TouchableOpacity } from "react-native"
import React from "react"

const GroupItem = ({ group, navigation }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Group", {
            title: group.name,
            group: group,
          })
        }
        className="border p-2 border-gray-400 rounded-md mr-3 w-24 h-24 flex flex-row justify-center items-center"
      >
        <Text className="text-gray-400">{group.name}</Text>
      </TouchableOpacity>
    </View>
  )
}

const CarouselGroups = ({ groups, navigation }) => {
  // console.log("desde el carrousel", groups)
  return (
    <View className="my-2">
      {groups.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={groups}
          renderItem={({ item }) => (
            <GroupItem navigation={navigation} group={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Sin resultados</Text>
      )}
    </View>
  )
}

export default CarouselGroups
