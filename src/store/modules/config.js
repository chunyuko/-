import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const config = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_config: (state, res) => {
      let len = res.data.length,
        pageSize = res.pageSize,
        pageNo = res.pageNo,
        success = res.success,
        msg = res.msg;
      state.result = {
        data: res.data,
        totalCount: len,
        totalPage: getPages(len, pageSize),
        pageNo,
        pageSize,
        msg,
        success,
      };
    },
    set_length: (state, val) => {
      state.length = Object.keys(val).length;
    },
  },

  actions: {
    load_config({ state, commit, getters, dispatch }, params) {
      return api.config
        .list()
        .then((res) => {
          commit("set_config", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_config({ state, commit, getters, dispatch }, params) {
      return dispatch("load_config", params);
    },
    // 获取信息列表
    list_config({ state, commit, getters, dispatch }, params) {
      let res = state.result.data
        ? new Promise((resolve, reject) => {
            return resolve(state.result);
          })
        : dispatch("load_config", params);
      return res.then((data) => {
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            return resolve(Object.assign(data, params));
          }, 200);
        }).then((res) => {
          return Promise.resolve(res);
        });
      });
    },
    add_config({ state, commit, getters, dispatch }, params) {
      return api.config
        .add({ data: params })
        .then((res) => {
          commit("set_config", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_config({ state, commit, getters, dispatch }, params) {
      return api.config
        .edit({ data: params })
        .then((res) => {
          commit("set_config", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_config({ state, commit, getters, dispatch }, params) {
      return api.config
        .del({ data: params })
        .then((res) => {
          commit("set_config", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_config({ state, commit, getters, dispatch }, params) {
      return api.config
        .del_multi({ data: params })
        .then((res) => {
          commit("set_config", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default config;
