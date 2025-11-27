// export interface AdminUserRow {
//   member_id: string;        // project_members 고유 ID
//   project_id: string;       // 어떤 프로젝트인지
//   project_name: string;     // 프로젝트 이름
//   user_id: string;          // 유저 ID
//   user_name: string;        // 유저 이름
//   email: string;            // 유저 이메일
//   role: "member" | "leader";
// }



export type UserInfoRow = {
email: string; 
user_name: string; 
global_role: "user" | "admin"

}