import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// type RawRow = {
//   member_id: string;
//   role: string;
//   project_id: string;
//   projects: { project_name: string };
//   users: { user_id: string; user_name: string; email: string };
// };




//user 정보 조회
export async function GET() {

  try {
    const {data, error} = await supabaseAdmin
    .from("users")
    .select(`user_name,email,global_role`)

    if (error) {
          console.error("Supabase error:", error);
          return NextResponse.json({ error: "DB error" }, { status: 500 });
        }

    return NextResponse.json(data)


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }  
}



// export async function GET() {
//   try {
//     const { data, error } = await supabaseAdmin
//       .from("project_members")
//       .select(`
//         member_id,
//         role,
//         project_id,
//         projects!fk_project_members_project (
//           project_name
//         ),
//         users!fk_project_members_user (
//           user_id,
//           user_name,
//           email
//         )
//       `);

//     if (error) {
//       console.error("Supabase error:", error);
//       return NextResponse.json({ error: "DB error" }, { status: 500 });
//     }

//     const rows = data as RawRow[] | any;
    
//     const formatted = rows.map((row : any) => ({
//       member_id: row.member_id,
//       project_id: row.project_id,
//       project_name: row.projects?.project_name,
//       user_id: row.users?.user_id,
//       user_name: row.users?.user_name,
//       email: row.users?.email,
//       role: row.role,
//     }));

//     return NextResponse.json(formatted);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

