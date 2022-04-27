

// import AWS from "aws-sdk"
// const _BucketName = "s3flpostrecture";

// const User = props => {
//   AWS.config.update({
//     region: "ap-northeast-2", // 버킷이 존재하는 리전을 문자열로 입력합니다. (Ex. "ap-northeast-2")
//     credentials: new AWS.CognitoIdentityCredentials({
//       IdentityPoolId: "ap-northeast-2:b7a01202-6664-4404-b06b-4115e473a149",
//     }),
//   })
//   const handleFileInput = e => {
//     const file = e.target.files[0]
//     const upload = new AWS.S3.ManagedUpload({
//       params: {
//         Bucket: _BucketName,
//         Key: "file" + ".jpg",
//         Body: file,
//       },
//     })

//     const promise = upload.promise()

//     promise.then(
//       function (data) {
//         alert("이미지 업로드에 성공했습니다.")
//       },
//       function (err) {
//         return alert("오류가 발생했습니다: ", err.message)
//       }
//     )
//   }
//   return (
//     <div>
//       <input type="file" id="upload" className="image-upload" onChange={handleFileInput} /> */}
//       <label htmlFor="upload" className="image-upload-wrapper"></label>
//     </div>
//   )
// }
// export default User;