const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/statics/stage" : "/",
  assetsDir: "assets",
  transpileDependencies: true,
  // lintOnSave: false, //关闭lint检测
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    proxy: {
      "/unite": { target: process.env.VUE_APP_UNITEURL, changeOrigin: true, pathRewrite: { "^/unite": "" } },
      "/statics": { target: process.env.VUE_APP_UNITEURL, changeOrigin: true },
      "/api": { target: process.env.VUE_APP_UNITEURL, changeOrigin: true },
      "/sys/files/down": { target: process.env.VUE_APP_UNITEURL, changeOrigin: true },
      // "/": { target: "http://192.168.10.118:6200", changeOrigin: true },
      // "/api": {
      //   target: "http://localhost:8080",
      //   bypass: function (req, res) {
      //     if (req.headers.accept.indexOf("html") !== -1) {
      //       return "/index.html";
      //     } else {
      //       try {
      //         const name = req.path.split("/api/")[1].split("/").join("_");
      //         const mockPath = `./mock/${name}`;
      //         const mock = require(mockPath);
      //         const result = mock(req.method);
      //         //清理mock缓存
      //         delete require.cache[require.resolve(`./mock/${name}`)];
      //         return res.send(result);
      //       } catch (error) {
      //         return res.send([]);
      //       }
      //     }
      //   },
      // },
    },
    // open: true,
  },
  // chainWebpack: (config) => {
  //   // 修改打包时css抽离后的filename及抽离所属目录
  //   config.plugin("extract-css").tap((args) => [
  //     {
  //       filename: "css/[name].[contenthash:8].css",
  //       chunkFilename: "css/[name].[contenthash:8].css",
  //     },
  //   ]);

  //   // 正式环境下，删除console和debugger
  //   config.optimization
  //     .minimize(true)
  //     .minimizer("terser")
  //     .tap((args) => {
  //       let { terserOptions } = args[0];
  //       terserOptions.compress.drop_console = true;
  //       terserOptions.compress.drop_debugger = true;
  //       return args;
  //     });
  // },
});

// module.exports = {
//   chainWebpack: (config) => {
//     //忽略的打包文件
//     config.externals({
//       vue: "Vue",
//       "vue-router": "VueRouter",
//       vuex: "Vuex",
//       axios: "axios",
//       "element-ui": "ELEMENT",
//       echarts: "echarts",
//       lodash: "lodash",
//       mock: "mock",
//     });
//     // config.plugin("TerserJSPlugin").use(
//     //   new TerserJSPlugin({
//     //     terserOptions: {
//     //       output: {
//     //         comments: false, // 去掉注释
//     //       },
//     //       warnings: false,
//     //       compress: {
//     //         // eslint-disable-next-line camelcase
//     //         drop_console: true,
//     //         // eslint-disable-next-line camelcase
//     //         drop_debugger: true,
//     //         pure_funcs: ["console.log"], // 移除console
//     //       },
//     //     },
//     //   })
//     // );
//     (config) => {
//       config.module
//         .rule("images")
//         .use("image-webpack-loader")
//         .loader("image-webpack-loader")
//         .options({
//           bypassOnDebug: true, // webpack  'debug' 模式下不执行
//         })
//         .end()
//         .end();
//     };
//   },
// };
