import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native"
import React, { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline"
import { Toast } from "react-native-toast-message/lib/src/Toast"
import { API_URL } from "../../config"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../../src/types"

const enum TypeProperties {
  oldPassword = "oldPassword",
  newPassword = "newPassword",
  repeatNewPassword = "repeatNewPassword",
}

type Props = NativeStackScreenProps<AuthStackParamList, "Settings">

const Settings = ({
  route: {
    params: { user },
  },
}: Props) => {
  const [modalNewPassword, setModalNewPassword] = useState({
    visible: false,
    data: {
      oldPassword: { text: "", hidden: true },
      newPassword: { text: "", hidden: true },
      repeatNewPassword: { text: "", hidden: true },
    },
  })

  const onChange = (property: TypeProperties, password: string) => {
    setModalNewPassword({
      ...modalNewPassword,
      data: {
        ...modalNewPassword.data,
        [property]: { ...modalNewPassword.data[property], text: password },
      },
    })
  }

  const setHiddenPassword = (property: TypeProperties) => {
    let findElementToEdit = modalNewPassword.data[property]
    setModalNewPassword({
      ...modalNewPassword,
      data: {
        ...modalNewPassword.data,
        [property]: { ...findElementToEdit, hidden: !findElementToEdit.hidden },
      },
    })
  }

  const resetPassword = async () => {
    let data = modalNewPassword.data
    if (data.newPassword.text != data.repeatNewPassword.text) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Las contraseñas no coinciden",
      })
      return
    }

    try {
      // zod_checkNameGroup.parse({ nameGroup })
      // setLoading(true)

      const response = await fetch(`${API_URL}/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword.text,
          newPassword: data.newPassword.text,
          userId: user?.id,
        }),
      })

      const { message } = await response.json()

      if (response?.ok) {
        // setLoading(false)
        setModalNewPassword({
          visible: false,
          data: {
            oldPassword: { text: "", hidden: true },
            newPassword: { text: "", hidden: true },
            repeatNewPassword: { text: "", hidden: true },
          },
        })
        Toast.show({
          type: "success",
          text1: "Excelente!",
          text2: message,
        })
      } else {
        // setLoading(false)
        Toast.show({
          type: "error",
          text1: "Hubo un error",
          text2: message,
        })
      }
    } catch (error: any) {
      console.log(error)
      // setError(JSON.parse(error?.message)[0]?.message)
      // setLoading(false)
    }
  }

  return (
    <>
      <View>
        <TouchableOpacity className="p-3 border-b border-gray-400">
          <Text>Cambiar nombre de usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 border-b border-gray-400"
          onPress={() =>
            setModalNewPassword({ ...modalNewPassword, visible: true })
          }
        >
          <Text>Cambiar contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border-b border-gray-400">
          <Text>Recuperar contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Modal new password */}
      <Modal
        animationType="slide"
        visible={modalNewPassword?.visible}
        onRequestClose={() =>
          setModalNewPassword({ ...modalNewPassword, visible: false })
        }
      >
        <View className="h-full flex justify-center items-center">
          <Toast />
          <Text>Ingresá tu contraseña actual</Text>
          <View className="w-11/12 px-1 mt-1 border-b border-blue-500 flex flex-row">
            <TextInput
              onChangeText={(e) => onChange(TypeProperties.oldPassword, e)}
              value={modalNewPassword.data?.oldPassword.text}
              autoCorrect={false}
              className="w-11/12 px-1 mt-1 text-lg"
              secureTextEntry={modalNewPassword.data?.oldPassword.hidden}
            />
            {modalNewPassword.data?.oldPassword.hidden ? (
              <EyeIcon
                className="w-1/12"
                size={25}
                color="#000000"
                onPress={(e) => setHiddenPassword(TypeProperties.oldPassword)}
              />
            ) : (
              <EyeSlashIcon
                className="w-1/12"
                size={25}
                color="#000000"
                onPress={(e) => setHiddenPassword(TypeProperties.oldPassword)}
              />
            )}
          </View>
          <Text className="mt-5">Ingresá tu nueva contraseña</Text>
          <View className="w-11/12 px-1 mt-1 border-b border-blue-500 flex flex-row">
            <TextInput
              onChangeText={(e) => onChange(TypeProperties.newPassword, e)}
              value={modalNewPassword.data?.newPassword.text}
              className="w-11/12 px-1 mt-1 text-lg"
              autoCorrect={false}
              secureTextEntry={modalNewPassword.data?.newPassword.hidden}
            />
            {modalNewPassword.data?.newPassword.hidden ? (
              <EyeIcon
                className="w-1/12"
                size={25}
                color="#000000"
                onPress={(e) => setHiddenPassword(TypeProperties.newPassword)}
              />
            ) : (
              <EyeSlashIcon
                className="w-1/12"
                size={25}
                color="#000000"
                onPress={(e) => setHiddenPassword(TypeProperties.newPassword)}
              />
            )}
          </View>
          <Text className="mt-5">Repetir nueva contraseña</Text>
          <View className="w-11/12 px-1 mt-1 border-b border-blue-500 flex flex-row">
            <TextInput
              onChangeText={(e) =>
                onChange(TypeProperties.repeatNewPassword, e)
              }
              value={modalNewPassword.data?.repeatNewPassword.text}
              className="w-11/12 px-1 mt-1 text-lg"
              autoCorrect={false}
              secureTextEntry={modalNewPassword.data?.repeatNewPassword.hidden}
            />
            {modalNewPassword.data?.repeatNewPassword.hidden ? (
              <EyeIcon
                className="w-1/12"
                size={25}
                color="#000000"
                onPress={(e) =>
                  setHiddenPassword(TypeProperties.repeatNewPassword)
                }
              />
            ) : (
              <EyeSlashIcon
                className="w-1/12"
                size={25}
                color="#000000"
                onPress={(e) =>
                  setHiddenPassword(TypeProperties.repeatNewPassword)
                }
              />
            )}
          </View>
          <TouchableOpacity
            className="bg-green-400 mt-5 rounded-2xl p-2 w-1/2 mx-auto"
            onPress={resetPassword}
          >
            <Text className="text-center text-white">Cambiar contraseña</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

export default Settings
