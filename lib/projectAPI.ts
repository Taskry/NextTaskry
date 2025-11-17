import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

interface ProjectProps {
  id?: string;
  name: string;
  type: string;
  status: string;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
  techStack: string;
  description: string;
}

interface ProjectMemberProps {
  id?: string;
  user: string;
  email: string;
  role: string;
}

interface ResultProps {
    message: string;
    params: object;
    data?: any[];
    timestamp: Timestamp;
}
const projectBaseURL = 'http://localhost:3000/api/project/test'
const projectMemberBaseURL = 'http://localhost:3000/api/projectMember/test'

// Project Info API
export async function getProject(id?:string): Promise<ResultProps> {
  try {
    const url = `${projectBaseURL}?id=${id}`
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
    const url = `${projectBaseURL}`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    const data = await res.json();
    console.log(data);

    return data
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function updateProject(id:string, projectData: ProjectProps): Promise<ProjectProps> {
  try {
    const url = `${projectBaseURL}?id=${id}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    console.log(data);

    return data
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function deleteProject(id:string): Promise<ProjectProps> {
  try {
    const url = `${projectBaseURL}?id=${id}`
    const res = await fetch(url, {
      method: 'DELETE'
    });
    const data = await res.json();
    
    return data;

  } catch (err){
    console.log(err);
    throw err;  
  }
}

// Project Member API
export async function getProjectMember(id?:string): Promise<ResultProps> {
  try {
    const url = `${projectMemberBaseURL}?id=${id}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function addProjectMember(projectMemberData: ProjectMemberProps): Promise<ProjectProps> {
  try {
    const url = `${projectMemberBaseURL}`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectMemberData),
    });
    const data = await res.json();
    console.log(data);

    return data
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function deleteProjectMember(id:string): Promise<ProjectProps> {
  try {
    const url = `${projectMemberBaseURL}?id=${id}`
    const res = await fetch(url, {
      method: 'DELETE'
    });
    const data = await res.json();
    
    return data;

  } catch (err){
    console.log(err);
    throw err;  
  }
}