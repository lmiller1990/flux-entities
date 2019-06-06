export const baseState = {
  ids: [],
  all: {}
}

export const selectableState = {
  ...baseState,
  selectedId: null
}

export const ajaxState = {
  touched: false,
  loading: false,
  errors: false
}

export const ajaxBaseState = {
  ...baseState,
  ...ajaxState
}

export const selectableAjaxBaseState = {
  ...baseState,
  ...ajaxState,
  ...selectableState
}