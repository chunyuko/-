import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const imgs = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_imgs: (state, res) => {
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
    load_imgs({ state, commit, getters, dispatch }, params) {
      return api.imgs
        .list()
        .then((res) => {
          commit("set_imgs", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_imgs({ state, commit, getters, dispatch }, params) {
      return dispatch("load_imgs", params);
    },
    // 获取信息列表
    list_imgs({ state, commit, getters, dispatch }, params) {
      let res = state.result.data
        ? new Promise((resolve, reject) => {
            return resolve(state.result);
          })
        : dispatch("load_imgs", params);
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
    add_imgs({ state, commit, getters, dispatch }, params) {
      return api.imgs
        .add({ data: params })
        .then((res) => {
          commit("set_imgs", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_imgs({ state, commit, getters, dispatch }, params) {
      return api.imgs
        .edit({ data: params })
        .then((res) => {
          commit("set_imgs", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_imgs({ state, commit, getters, dispatch }, params) {
      return api.imgs
        .del({ data: params })
        .then((res) => {
          commit("set_imgs", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_imgs({ state, commit, getters, dispatch }, params) {
      return api.imgs
        .del_multi({ data: params })
        .then((res) => {
          commit("set_imgs", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default imgs;
