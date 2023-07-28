import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native"
import React, { useEffect, useState, useRef, Ref } from "react"
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
const enum TypePropertiesRecover {
  newPassword = "newPassword",
  repeatNewPassword = "repeatNewPassword",
}

const enum StepsRecPwd {
  sendEmail = "sendEmail",
  sendCode = "sendCode",
  sendNewPassword = "sendNewPassword",
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

  const [stepRec, setStepRec] = useState<StepsRecPwd>(StepsRecPwd.sendEmail)

  const [disabledButtonSave, setDisabledButtonSave] = useState(true)

  // Modal recover
  const [modalRecoverPassword, setModalRecoverPassword] = useState({
    visible: false,
    data: {
      email: "",
      code: { otp: { 1: "", 2: "", 3: "", 4: "" }, hidden: true },
      newPassword: { text: "", hidden: true },
      repeatNewPassword: { text: "", hidden: true },
    },
  })
  const firstInputCode = useRef<TextInput>(null)
  const secondInputCode = useRef<TextInput>(null)
  const thirdInputCode = useRef<TextInput>(null)
  const fourthInputCode = useRef<TextInput>(null)

  const [inputCodeFocused, setInputCodeFocused] =
    useState<React.RefObject<TextInput>>()

  useEffect(() => {
    let { oldPassword, newPassword, repeatNewPassword } = modalNewPassword.data
    if (
      oldPassword.text.length != 0 &&
      newPassword.text.length != 0 &&
      repeatNewPassword.text.length != 0
    ) {
      setDisabledButtonSave(false)
    } else {
      setDisabledButtonSave(true)
    }
  }, [modalNewPassword.data])

  const onChange = (property: TypeProperties, password: string) => {
    setModalNewPassword({
      ...modalNewPassword,
      data: {
        ...modalNewPassword.data,
        [property]: { ...modalNewPassword.data[property], text: password },
      },
    })
  }

  // Fusionar con el de arriba
  const onChangeRecover = (
    property: TypePropertiesRecover,
    password: string
  ) => {
    setModalRecoverPassword({
      ...modalRecoverPassword,
      data: {
        ...modalRecoverPassword.data,
        [property]: { ...modalRecoverPassword.data[property], text: password },
      },
    })
  }

  const onChangeInputCode = (
    property: number,
    code: string,
    nextInput?: React.RefObject<TextInput>,
    prevInput?: React.RefObject<TextInput>
  ) => {
    setModalRecoverPassword({
      ...modalRecoverPassword,
      data: {
        ...modalRecoverPassword.data,
        code: {
          ...modalRecoverPassword.data.code,
          otp: { ...modalRecoverPassword.data.code.otp, [property]: code },
        },
      },
    })

    if (code.length == 0 && prevInput) {
      prevInput.current?.focus()
      return
    }

    if (code.length != 0 && nextInput) {
      nextInput.current?.focus()
      return
    }

    // prevRef && prevRef.current?.focus()
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

  const changePassword = async () => {
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

      const response = await fetch(`${API_URL}/changePassword`, {
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

  const requestCodeRecPwd = async () => {
    console.log(modalRecoverPassword.data.email, user.email)
    if (modalRecoverPassword.data.email != user.email) {
      Toast.show({
        type: "error",
        text1: "Hubo un error!",
        text2: "El email ingresado es incorrecto",
        visibilityTime: 3000,
      })

      return
    }
    try {
      const response = await fetch(`${API_URL}/requestCodeRecPwd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: modalRecoverPassword.data.email,
        }),
      })

      const { message } = await response.json()

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Excelente!",
          text2: message,
          visibilityTime: 5000,
        })
        setStepRec(StepsRecPwd.sendCode)
      } else {
        Toast.show({
          type: "error",
          text1: "Hubo un error",
          text2: message,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const sendCode = async () => {
    // if (modalRecoverPassword.data.email != user.email) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Hubo un error!",
    //     text2: "El email ingresado es incorrecto",
    //     visibilityTime: 3000,
    //   })

    //   return
    // }
    try {
      const response = await fetch(`${API_URL}/verifyCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: modalRecoverPassword.data.email,
          code: Object.entries(modalRecoverPassword.data.code.otp)
            .map(([, value]) => `${value}`)
            .join(""),
        }),
      })

      const { message } = await response.json()

      if (response.ok) {
        setStepRec(StepsRecPwd.sendNewPassword)
      } else {
        Toast.show({
          type: "error",
          text1: "Hubo un error",
          text2: message,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const resetPassword = async () => {
    let data = modalRecoverPassword.data
    console.log(data.newPassword.text, data.repeatNewPassword.text)
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
          newPassword: data.newPassword.text,
          userEmail: data.email,
        }),
      })

      // console.log(response)

      const { message } = await response.json()

      if (response?.ok) {
        // setLoading(false)
        setModalRecoverPassword({
          visible: false,
          data: {
            email: "",
            code: { otp: { 1: "", 2: "", 3: "", 4: "" }, hidden: true },
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
        {/* <TouchableOpacity
          onPress={() =>
            setModalNewPassword({ ...modalNewPassword, visible: true })
          }
          className="p-3 border-b border-gray-400"
        >
          <Text>Cambiar nombre de usuario</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          className="p-3 border-b border-gray-400"
          onPress={() =>
            setModalNewPassword({ ...modalNewPassword, visible: true })
          }
        >
          <Text>Cambiar contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 border-b border-gray-400"
          onPress={() =>
            setModalRecoverPassword({ ...modalRecoverPassword, visible: true })
          }
        >
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
              secureTextEntry={modalNewPassword.data.oldPassword.hidden}
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
              secureTextEntry={modalNewPassword.data.newPassword.hidden}
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
              secureTextEntry={modalNewPassword.data.repeatNewPassword.hidden}
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
            disabled={disabledButtonSave}
            className={`bg-green-400 mt-5 rounded-2xl p-2 w-1/2 mx-auto ${
              disabledButtonSave && "bg-green-200"
            }`}
            onPress={changePassword}
          >
            <Text className="text-center text-white">Cambiar contraseña</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/*------- Modal recover password -------*/}
      <Modal
        animationType="slide"
        visible={modalRecoverPassword?.visible}
        onRequestClose={() =>
          setModalRecoverPassword({ ...modalRecoverPassword, visible: false })
        }
      >
        <View className="h-full flex justify-center items-center">
          <Toast />
          {stepRec == StepsRecPwd.sendEmail ? (
            <View>
              <Text>Ingresá tu email</Text>
              <View className="w-11/12 px-1 mt-1 border-b border-blue-500 flex flex-row">
                <TextInput
                  onChangeText={(e) =>
                    setModalRecoverPassword({
                      ...modalRecoverPassword,
                      data: { ...modalRecoverPassword.data, email: e },
                    })
                  }
                  value={modalRecoverPassword.data.email}
                  autoCorrect={false}
                  className="w-full px-1 mt-1 text-lg"
                  keyboardType="email-address"
                />
              </View>
              <TouchableOpacity
                disabled={modalRecoverPassword.data.email.length < 4}
                className={`bg-green-400 mt-5 rounded-2xl p-2 w-1/2 mx-auto ${
                  modalRecoverPassword.data.email.length < 4 && "bg-green-200"
                }`}
                onPress={requestCodeRecPwd}
              >
                <Text className="text-center text-white">Siguiente</Text>
              </TouchableOpacity>
            </View>
          ) : stepRec == StepsRecPwd.sendCode ? (
            <View>
              <Text className="mt-5">Ingresá el código de recuperación</Text>
              <View className="flex flex-row justify-evenly">
                <TextInput
                  ref={firstInputCode}
                  onChangeText={(e) => {
                    onChangeInputCode(1, e, secondInputCode)
                  }}
                  value={modalRecoverPassword.data.code.otp[1]}
                  maxLength={1}
                  autoCorrect={false}
                  keyboardType="numeric"
                  className={`px-2 py-1 mt-1 text-lg border text-center rounded-md ${
                    firstInputCode?.current?.isFocused() && "border-yellow-500"
                  }`}
                  onFocus={() => {
                    firstInputCode?.current?.focus()
                    // setInputCodeFocused(firstInputCode)
                  }}
                />
                <TextInput
                  ref={secondInputCode}
                  onChangeText={(e) => {
                    onChangeInputCode(2, e, thirdInputCode, firstInputCode)
                  }}
                  value={modalRecoverPassword.data.code.otp[2]}
                  maxLength={1}
                  autoCorrect={false}
                  keyboardType="numeric"
                  className={`px-2 py-1 mt-1 text-lg border text-center rounded-md ${
                    secondInputCode?.current?.isFocused() && "border-yellow-500"
                  }`}
                  onFocus={() => {
                    secondInputCode?.current?.focus()
                  }}
                  focusable={false}
                />
                <TextInput
                  ref={thirdInputCode}
                  onChangeText={(e) => {
                    onChangeInputCode(3, e, fourthInputCode, secondInputCode)
                  }}
                  value={modalRecoverPassword.data.code.otp[3]}
                  maxLength={1}
                  autoCorrect={false}
                  keyboardType="numeric"
                  className={`px-2 py-1 mt-1 text-lg border text-center rounded-md ${
                    thirdInputCode?.current?.isFocused() && "border-yellow-500"
                  }`}
                  onFocus={() => {
                    thirdInputCode?.current?.focus()
                  }}
                />
                <TextInput
                  ref={fourthInputCode}
                  onChangeText={(e) => {
                    onChangeInputCode(4, e, undefined, thirdInputCode)
                  }}
                  value={modalRecoverPassword.data.code.otp[4]}
                  maxLength={1}
                  autoCorrect={false}
                  keyboardType="numeric"
                  className={`px-2 py-1 mt-1 text-lg border text-center rounded-md ${
                    fourthInputCode?.current?.isFocused() && "border-yellow-500"
                  }`}
                  onFocus={() => {
                    fourthInputCode?.current?.focus()
                  }}
                />
              </View>
              <TouchableOpacity
                // disabled={disabledButtonSave}
                className={`bg-green-400 mt-5 rounded-2xl p-2 w-1/2 mx-auto ${
                  disabledButtonSave && "bg-green-200"
                }`}
                onPress={sendCode}
              >
                <Text className="text-center text-white">Enviar código</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text className="mt-5">Ingresá tu nueva contraseña</Text>
              <View className="w-11/12 px-1 mt-1 border-b border-blue-500 flex flex-row">
                <TextInput
                  onChangeText={(e) =>
                    onChangeRecover(TypePropertiesRecover.newPassword, e)
                  }
                  value={modalRecoverPassword.data?.newPassword.text}
                  className="w-11/12 px-1 mt-1 text-lg"
                  autoCorrect={false}
                  secureTextEntry={
                    modalRecoverPassword.data?.newPassword.hidden
                  }
                />
                {modalNewPassword.data?.newPassword.hidden ? (
                  <EyeIcon
                    className="w-1/12"
                    size={25}
                    color="#000000"
                    onPress={(e) =>
                      setHiddenPassword(TypeProperties.newPassword)
                    }
                  />
                ) : (
                  <EyeSlashIcon
                    className="w-1/12"
                    size={25}
                    color="#000000"
                    onPress={(e) =>
                      setHiddenPassword(TypeProperties.newPassword)
                    }
                  />
                )}
              </View>
              <Text className="mt-5">Repetir nueva contraseña</Text>
              <View className="w-11/12 px-1 mt-1 border-b border-blue-500 flex flex-row">
                <TextInput
                  onChangeText={(e) =>
                    onChangeRecover(TypePropertiesRecover.repeatNewPassword, e)
                  }
                  value={modalRecoverPassword.data?.repeatNewPassword.text}
                  className="w-11/12 px-1 mt-1 text-lg"
                  autoCorrect={false}
                  secureTextEntry={
                    modalRecoverPassword.data?.repeatNewPassword.hidden
                  }
                />
                {modalRecoverPassword.data?.repeatNewPassword.hidden ? (
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
                // disabled={disabledButtonSave}
                className={`bg-green-400 mt-5 rounded-2xl p-2 w-1/2 mx-auto ${
                  disabledButtonSave && "bg-green-200"
                }`}
                onPress={resetPassword}
              >
                <Text className="text-center text-white">
                  Cambiar contraseña
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  )
}

export default Settings
