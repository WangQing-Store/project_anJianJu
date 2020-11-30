<template>
  <div style="display:flex">
    <div v-if="isUploadImg">
      <el-upload
        :headers="getItemtoken"
        :action="BannerURL"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :on-success="safehandleAddSuccess"
        :disabled="disabled"
        :multiple="multiple"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="photodialogVisible" append-to-body @close="closeDialog">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
    <div v-if="isUploadVideo" style="width: 100%" :style="{'display':isFlex ? 'flex' : 'block'}">
      <div style="margin-right:10px;display: flex;flex-wrap: wrap;">
        <video
          v-if="videoForm.videoPath !='' && videoFlag == false && !multiple"
          :src="videoForm.videoPath"
          class="avatar"
          controls
        >您的浏览器不支持视频播放</video>
        <template v-if="videoForm.length>0 && videoFlag == false && multiple">
          <div
            v-for="(item,index) of videoForm"
            :key="index"
            style="position: relative;"
            class="videoBoxs"
          >
            <i class="el-icon-delete-solid" @click="deleteSolid(index)"></i>
            <video style="margin-right:10px" :src="item.path" class="avatar" controls>您的浏览器不支持视频播放</video>
          </div>
        </template>
        <!-- <i
          v-if="videoForm.videoPath !='' && videoFlag == false"
          class="el-icon-plus avatar-uploader-icon"
        ></i>-->
        <el-progress
          v-if="videoFlag == true"
          type="circle"
          :percentage="videoUploadPercent"
          style="margin-top:30px;"
        ></el-progress>
      </div>
      <!-- action必选参数, 上传的地址 -->
      <el-upload
        :action="BannerURL"
        :headers="getItemtoken"
        list-type="picture-card"
        :show-file-list="false"
        :on-success="handleVideoSuccess"
        :before-upload="beforeUploadVideo"
        :on-progress="uploadVideoProcess"
        :disabled="disabled"
        :multiple="multiple"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { IMG_FILE } from "@/api/config"
export default {
  props: [
    "BannerURL", //基路径
    "fileList", //图片数组
    // "photodialogVisible",
    // "dialogImageUrl",
    "getItemtoken", //token
    "videoForm", //视频
    "isUploadImg", //判断是否为上传图片
    "isUploadVideo", //判断是否为上传视频
    "disabled",
    "multiple",
    "isFlex"
  ],
  data() {
    return {
      photodialogVisible: false,
      dialogImageUrl: "",
      videoFlag: false,
      videoUploadPercent: ""
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      // this.$emit("onPreview", file.url);
      this.photodialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.$emit("RemoveFileList", { file, fileList });
    },
    safehandleAddSuccess(res) {
      this.$emit("onSuccess", res);
    },
    handlePictureVideoPreview(file) { },

    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },
    // 显示视频上传进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      // this.videoUploadPercent = file.percentage.toFixed(0);
      this.videoUploadPercent = Math.floor(event.percent);
    },
    handleVideoSuccess(res, file) {
      //获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.$emit("handleVideoSuccess", res);
    },
    closeDialog() {
      this.photodialogVisible = false;
    },
    deleteSolid(index) {
      this.$emit("deleteSolid", index)
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.avatar {
  /* width: 100%; */
  height: 150px;
  box-sizing: border-box;
}
.el-icon-delete-solid {
  padding: 15px;
  position: absolute;
  right: 10px;
  top: 30%;
  z-index: 10000;
}
</style>
