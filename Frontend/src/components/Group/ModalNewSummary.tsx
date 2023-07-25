import {
  SafeAreaView,
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import React, { useState } from "react"
import { Group } from "../../interfaces/prisma.interfaces"
import { API_URL } from "../../../config"
import Toast from "react-native-toast-message"
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import dayjs from "dayjs"
import { date } from "zod"
import { createSummary } from "../../services/summary"
import { userInfo } from "../../types"

interface Props {
  group: Group
  show: boolean
  closeModal: () => void
  navigation: any
  userInfo?: userInfo
}

const enum TypeDates {
  dateStart = "dateStart",
  dateEnd = "dateEnd",
}

const ModalNewSummary = ({
  group,
  show,
  closeModal,
  navigation,
  userInfo,
}: Props) => {
  const [dates, setDates] = useState<{ dateStart: Date; dateEnd: Date }>({
    dateStart: dayjs().subtract(14, "d").toDate(),
    dateEnd: dayjs().toDate(),
  })
  const [showCalendarDateStart, setShowCalendarDateStart] = useState(false)
  const [showCalendarDateEnd, setShowCalendarDateEnd] = useState(false)

  const onChangeDate = (e: DateTimePickerEvent, property: TypeDates) => {
    property == TypeDates.dateStart
      ? setShowCalendarDateStart(false)
      : setShowCalendarDateEnd(false)

    if (e.nativeEvent.timestamp)
      setDates({
        ...dates,
        [property]: dayjs(e.nativeEvent.timestamp).toDate(),
      })
  }

  const generateSummary = async () => {
    const { dateStart, dateEnd } = dates
    try {
      await createSummary({
        dateEnd,
        dateStart,
        groupId: group.id,
        userId: userInfo?.id,
      })

      Toast.show({
        type: "success",
        text1: "Excelente!",
        text2: "Se ha creado el resúmen con éxito",
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal animationType="fade" visible={show} onRequestClose={closeModal}>
      <SafeAreaView className="h-screen flex flex-col p-3">
        <Toast />
        <ScrollView>
          <Text className="text-center text-lg">Agregar resúmen</Text>
          <Text>
            Fecha inicio: {dayjs(dates.dateStart).format("DD [de] MMMM")}
          </Text>
          <TouchableOpacity
            className="border rounded-lg p-2 mb-5 w-1/2"
            onPress={() => setShowCalendarDateStart(true)}
          >
            <Text className="text-center">Seleccionar fecha</Text>
          </TouchableOpacity>
          {showCalendarDateStart && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dates.dateStart}
              mode="date"
              onChange={(e) => onChangeDate(e, TypeDates.dateStart)}
            />
          )}

          <Text>
            Fecha inicio: {dayjs(dates.dateEnd).format("DD [de] MMMM")}
          </Text>
          <TouchableOpacity
            className="border rounded-lg p-2 mb-5 w-1/2"
            onPress={() => setShowCalendarDateEnd(true)}
          >
            <Text className="text-center">Seleccionar fecha</Text>
          </TouchableOpacity>
          {showCalendarDateEnd && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dates.dateEnd}
              mode="date"
              onChange={(e) => onChangeDate(e, TypeDates.dateEnd)}
            />
          )}

          <Pressable
            onPress={generateSummary}
            className="border border-green-500 p-2 w-1/3 mx-auto rounded-lg"
          >
            <Text className="text-center text-green-500">Generar</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default ModalNewSummary
