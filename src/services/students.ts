import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const getStudents = async () => {
    const response = await axios.get(`${API_URL}/Student`);
    return response.data;
}

export const createStudents = async (    
    name: "", 
    lastName: "", 
    email: "", 
    age: 0 
) => {
    const response = await axios.post(`${API_URL}/Student`, {
        name,
        lastName,
        email,
        age
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
} 

export const updateStudents = async (id:string, name:string, lastName:string, email:string, age:number) => {
    const response = await axios.put(`${API_URL}/Student?id=${id}`,{
        name,
        lastName,
        email,
        age
    }); 
    return response.data;
}

export const deleteStudents = async (id:string) => {
    const response = await axios.delete(`${API_URL}/Student?id=${id}`);
    return response.data;
}
