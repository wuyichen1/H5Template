const defaultMessage = 'To ensure the normal operation of the function, please log in to your account first.'

const loginPopupVisible = ref(false)
const loginPopupMessage = ref(defaultMessage)
let loginConfirmHandler: null | (() => void) = null

export const useLoginPopup = () => {
  const openLoginPopup = (
    message = defaultMessage,
    onConfirm?: () => void
  ) => {
    loginPopupMessage.value = message || defaultMessage
    loginConfirmHandler = onConfirm || null
    loginPopupVisible.value = true
  }

  const closeLoginPopup = () => {
    loginPopupVisible.value = false
  }

  const confirmLoginPopup = () => {
    loginConfirmHandler?.()
    closeLoginPopup()
  }

  return {
    loginPopupVisible,
    loginPopupMessage,
    openLoginPopup,
    closeLoginPopup,
    confirmLoginPopup
  }
}

