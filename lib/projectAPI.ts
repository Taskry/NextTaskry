import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

interface ProjectProps {
  projectId?: string;
  projectName: string;
  type: string;
  status: string;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
  techStack: string;
  description: string;
}

interface ProjectMemberProps {
  projectId: string | undefined;
  userId: string;
  email: string;
  role: string;
}

interface ResultProps {
    message: string;
    params: object;
    data?: any[];
    totalCount?: number;
    timestamp: Timestamp;
}

const PROJECT_BASE_URL = 'http://localhost:3000/api/project'
const PROJECT_MEMBER_BASE_URL = 'http://localhost:3000/api/projectMember'

// Project Info API
export async function getProject(): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function getProjectById(id:string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?id=${id}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function createProject(projectData: ProjectProps): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    const data = await res.json();

    return data
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function updateProject(id:string, projectData: ProjectProps): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?id=${id}`
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

export async function deleteProject(id:string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?id=${id}`
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
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.log(err);
    throw err;  
  }
}

export async function addProjectMember(projectMemberData: ProjectMemberProps): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectMemberData),
    });
    const data = await res.json();

    return data
  } catch (err){
    console.log(err);
    throw err;  
  }
}


export async function updateProjectMember(id:string, projectMemberData: ProjectMemberProps): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}`
    const res = await fetch(url, {
      method: 'PUT',
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

export async function deleteProjectMember(id:string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}`
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