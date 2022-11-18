import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const video1 = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_video1: (state, res) => {
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
    load_video1({ state, commit, getters, dispatch }, params) {
      return api.video1
        .list({ params: { videomenu: params.id } })
        .then((res) => {
          commit("set_video1", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_video1({ state, commit, getters, dispatch }, params) {
      return dispatch("load_video1", params);
    },
    // 获取信息列表
    list_video1({ state, commit, getters, dispatch }, params) {
      let res = dispatch("load_video1", params);
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
    add_video1({ state, commit, getters, dispatch }, params) {
      return api.video1
        .add({ data: params })
        .then((res) => {
          commit("set_video1", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_video1({ state, commit, getters, dispatch }, params) {
      return api.video1
        .edit({ data: params })
        .then((res) => {
          commit("set_video1", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_video1({ state, commit, getters, dispatch }, params) {
      return api.video1
        .del({ data: params })
        .then((res) => {
          commit("set_video1", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_video1({ state, commit, getters, dispatch }, params) {
      return api.video1
        .del_multi({ data: params })
        .then((res) => {
          commit("set_video1", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default video1;
