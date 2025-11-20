import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

interface ResultProps {
    message: string;
    params: object;
    data?: any[];
    count?: number;
    timestamp: Timestamp;
}
const USER_BASE_URL = 'http://localhost:3000/api/users/test'

// Project Info API
export async function getUser(): Promise<ResultProps> {
  try {
    const url = `${USER_BASE_URL}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.error(err);
    throw err;  
  }
}

export async function getUserById(type:string, id:number): Promise<ResultProps> {
  try {
    const url = `${USER_BASE_URL}?type=${type}&id=${id}`
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err){
    console.log(err);
    throw err;  
  }
}