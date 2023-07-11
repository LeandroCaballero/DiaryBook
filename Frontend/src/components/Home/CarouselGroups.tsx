import { View, Text, FlatList, TouchableOpacity } from "react-native"
import React from "react"
import { Group } from "../../interfaces/prisma.interfaces"

interface CarouselGroupsProps {
  groups: Group[]
  navigation: any
}

interface GroupItemProps {
  group: Group
  navigation: any
}

const GroupItem = ({ group, navigation }: GroupItemProps) => {
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

const CarouselGroups = ({ groups, navigation }: CarouselGroupsProps) => {
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
          // keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Sin resultados</Text>
      )}
    </View>
  )
}

export default CarouselGroups
