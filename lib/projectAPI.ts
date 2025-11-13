import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

interface ProjectProps {
  userName?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  globalRole?: string;
  authProvider?: string;
  isActive?: boolean;  
}

interface ResultProps {
    message: string;
    params: object;
    data?: any[];
    timestamp: Timestamp;
}
const baseURL = 'http://localhost:3000/api/project/test'

export async function getProject(id?:string): Promise<ResultProps> {
  try {
    const url = `${baseURL}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function createProject(projectData: ProjectProps): Promise<ProjectProps> {
  try {
    const url = `${baseURL}`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    const data = await res.json();
    console.log(data);

    return {}
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function updateProject(id:string, projectData: ProjectProps): Promise<ProjectProps> {
  try {
    const url = `${baseURL}/${id}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    console.log(data);

    return {}
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function deleteProject(id:string): Promise<ProjectProps> {
  try {
    const url = `${baseURL}/${id}`
    const res = await fetch(url, {
      method: 'DELETE',
    });
    const data = await res.json();
    console.log(data);

    return {}

  } catch (err){
    console.log(err);
    throw err;  
  }
}
