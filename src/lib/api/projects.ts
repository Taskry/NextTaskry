interface ResultProps {
  message: string;
  params: object;
  data?: any[];
  totalCount?: number;
  timestamp: Date;
}

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
  projectId: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
}

const PROJECT_BASE_URL = "http://localhost:3000/api/projects";
const PROJECT_MEMBER_BASE_URL = "http://localhost:3000/api/projectMembers";

// Project Info API
export async function getProject(): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getProjectById(id: string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?id=${id}`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getProjectByIds(ids: string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?ids=${ids}`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}


export async function createProject(
  projectData: ProjectProps
): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateProject(
  id: string,
  projectData: ProjectProps
): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?id=${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteProject(id: string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_BASE_URL}?id=${id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Project Member API
export async function getProjectMember(id?: string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export async function getProjectMemberByRole(id?: string, role?:string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}&role=${role}`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export async function getProjectMemberByUser(id?: string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?userId=${id}`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateProjectMember(id?: string, projectMemberData?: ProjectMemberProps[]): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectMemberData),
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteProjectMember(id: string): Promise<ResultProps> {
  try {
    const url = `${PROJECT_MEMBER_BASE_URL}?id=${id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
