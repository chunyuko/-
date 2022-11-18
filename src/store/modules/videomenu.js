import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const videomenu = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_videomenu: (state, res) => {
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
    load_videomenu({ state, commit, getters, dispatch }, params) {
      return api.videomenu
        .list({ params: { videos: params.videos } })
        .then((res) => {
          commit("set_videomenu", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_videomenu({ state, commit, getters, dispatch }, params) {
      return dispatch("load_videomenu", params);
    },
    // 获取信息列表
    list_videomenu({ state, commit, getters, dispatch }, params) {
      let res =
        state.result.data && !params.refresh
          ? new Promise((resolve, reject) => {
              return resolve(state.result);
            })
          : dispatch("load_videomenu", params);
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
    add_videomenu({ state, commit, getters, dispatch }, params) {
      return api.videomenu
        .add({ data: params })
        .then((res) => {
          commit("set_videomenu", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_videomenu({ state, commit, getters, dispatch }, params) {
      return api.videomenu
        .edit({ data: params })
        .then((res) => {
          commit("set_videomenu", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_videomenu({ state, commit, getters, dispatch }, params) {
      return api.videomenu
        .del({ data: params })
        .then((res) => {
          commit("set_videomenu", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_videomenu({ state, commit, getters, dispatch }, params) {
      return api.videomenu
        .del_multi({ data: params })
        .then((res) => {
          commit("set_videomenu", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default videomenu;
