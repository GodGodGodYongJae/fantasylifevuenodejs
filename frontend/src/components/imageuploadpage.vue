<template>
  <div>
    <h1>파일리스트</h1>
    <div v-for="file in fileList" :key="file.Key">
      {{ file.Key }}
      <img
        :src="`https://s3flpostrecture.s3.ap-northeast-2.amazonaws.com/${file.Key}`"
        alt=""
      />
    </div>

    <h1>파일업로더</h1>
    <input
      id="file-selector"
      ref="file"
      type="file"
      @change="handleFileUpload()"
    />
    <b-button @click="upload">업로드</b-button>
  </div>
</template>
<script>
import AWS from "aws-sdk";
export default {
  name: "test-imageupload", //컴포넌트 이름
  components: {}, //다른 컴포넌트 사용시 import하고, 배열로 저장
  data() {
    // html과 자바스크립트 코드에서 사용할 데이터 변수 선언
    return {
      sampleData: "",
      file: null,
      fileList: [],
      albumBuketName: "s3flpostrecture",
      bucketRegion: "ap-northeast-2",
      IdentifyPoolId: "ap-northeast-2:b7a01202-6664-4404-b06b-4115e473a149",
    };
  },

  setup() {}, //컴포지션 API
  created() {
    this.getFiles();
  }, // 컴포넌트가 생성되면 실행
  unmounted() {}, // ummount가 완료된 후 실행
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log(this.file, "파일을 올렸습니다.");
    },
    upload() {
      AWS.config.update({
        region: this.bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: this.IdentifyPoolId,
        }),
      });

      var s3 = new AWS.S3({
        apiVersion: "2022-04-22",
        params: {
          Bucket: this.albumBuketName,
        },
      });

      let photoKey = this.file.name;
      s3.upload(
        {
          Key: photoKey,
          Body: this.file,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            return alert("파일 업로드 실패", err.message);
          }
          alert("파일 업로드 성공! ");
          console.log(data);
        }
      );
    },
    getFiles() {
      AWS.config.update({
        region: this.bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: this.IdentifyPoolId,
        }),
      });

      var s3 = new AWS.S3({
        apiVersion: "2022-04-22",
        params: {
          Bucket: this.albumBuketName,
        },
      });
      s3.listObjects(
        {
          Delimiter: "/",
        },
        (err, data) => {
          if (err) {
            return alert("이미지 불러오기 실패", err.message);
          } else {
            this.fileList = data.Contents;
            console.log(data);
          }
        }
      );
    },
  }, // 컴포넌트 내에서 사용할 메소드 정의
};
</script>