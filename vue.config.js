const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  pages: {
    index: {
      entry: "src/main.ts",
      template: "index.html",
    },
  },
  // webpack配置别名
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
    config.resolve.symlinks(true);
  },
  configureWebpack: {
    resolve: {
      extensions: [".js", ".json", ".vue", ".ts"],
    },
  },
  devServer: {
    // 本地ip地址
    // host: "localhost",
    port: 3030,
    https: false,
    hotOnly: true,
    // open: false,
    /* 使用代理 */
    proxy: {
      "/apis": {
        /* 目标代理服务器地址 */
        target: "http://47.112.167.239:8301",
        /* 允许跨域 */
        changeOrigin: true,
        // ws: true,
        pathRewrite: {
          "^/apis": "",
        },
      },
    },
  },
};
