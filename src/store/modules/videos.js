import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const videos = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_videos: (state, res) => {
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
    load_videos({ state, commit, getters, dispatch }, params) {
      return api.videos
        .list()
        .then((res) => {
          commit("set_videos", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_videos({ state, commit, getters, dispatch }, params) {
      return dispatch("load_videos", params);
    },
    // 获取信息列表
    list_videos({ state, commit, getters, dispatch }, params) {
      let res = state.result.data
        ? new Promise((resolve, reject) => {
            return resolve(state.result);
          })
        : dispatch("load_videos", params);
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
    add_videos({ state, commit, getters, dispatch }, params) {
      return api.videos
        .add({ data: params })
        .then((res) => {
          commit("set_videos", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_videos({ state, commit, getters, dispatch }, params) {
      return api.videos
        .edit({ data: params })
        .then((res) => {
          commit("set_videos", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_videos({ state, commit, getters, dispatch }, params) {
      return api.videos
        .del({ data: params })
        .then((res) => {
          commit("set_videos", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_videos({ state, commit, getters, dispatch }, params) {
      return api.videos
        .del_multi({ data: params })
        .then((res) => {
          commit("set_videos", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default videos;
