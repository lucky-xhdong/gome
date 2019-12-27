import * as types from './mutation-types'

export const setLogin = function ({commit}, LOGINDATA) {
  commit(types.SET_LOGINDATA, LOGINDATA)
}
